import os
import gc
import numpy as np
from io import BytesIO
from PIL import Image, ImageDraw
import requests
import asyncio
from dotenv import load_dotenv
from typing import Tuple, Dict, List
from azure.storage.blob import ContainerClient
from azure.storage.queue import QueueClient
import logging
import requests
import shutil

from image_generation.utils import meters_to_pixels, lat_lon_to_tile
from azure_utils.blob_storage import upload_image_to_blob
from azure_utils.cosmos import set_total_images

logging.basicConfig(level=logging.INFO)

load_dotenv()

azure_maps_key = os.getenv('AZURE_MAPS_KEY')

# create a session for connection pooling
session = requests.Session()

async def fetch_tile(session, x: float, y: float, zoom: int, tile_dir: str) -> Image.Image:
    """Fetch a map tile from Azure Maps."""
    url = f"https://atlas.microsoft.com/map/tile?subscription-key={azure_maps_key}&api-version=2022-08-01&tilesetId=microsoft.imagery&zoom={zoom}&x={x}&y={y}&format=png"
    response = await asyncio.to_thread(session.get, url)
    if response.status_code == 200:
        tile_path = os.path.join(tile_dir, f"tile_{x}_{y}.png")
        with open(tile_path, 'wb') as f:
            f.write(response.content)
        return tile_path
    return None

def apply_circular_mask(image: Image.Image, center: Tuple[int, int], radius: int) -> Image.Image:
    """Apply a black circular mask to the image."""
    # Create a mask with the same size as the image, filled with white
    mask = Image.new('L', image.size, 255)
    draw = ImageDraw.Draw(mask)

    # Draw a black circle on the mask
    draw.ellipse((center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius), fill=0)

    # Create a black image with the same size as the original image
    black_image = Image.new('RGB', image.size, (0, 0, 0))

    # Combine the original image with the black image using the mask
    masked_image = Image.composite(black_image, image, mask)

    black_image.close()
    mask.close()
    gc.collect()

    return masked_image

def split_image(image: Image.Image, tile_size: int, tile_dir: str) -> List[Image.Image]:
    """Split a large image into smaller tiles."""
    tiles = []

    num_tiles_x = image.width // tile_size
    num_tiles_y = image.height // tile_size
    for x in range(num_tiles_x):
        for y in range(num_tiles_y):
            box = (x * tile_size, y * tile_size, (x + 1) * tile_size, (y + 1) * tile_size)
            tile = image.crop(box)
            if tile.getbbox():  # Check if tile is not completely empty
                tile_path = os.path.join(tile_dir, f"tile_{x}_{y}.png")
                tile.save(tile_path)
                tiles.append(tile_path)
            # explicitly call garbage collector to avoid memory issues
            tile.close()
            gc.collect()

    image.close()

    return tiles

async def generate_tiles(latitude: float, longitude: float, radius_meters: int, container_client: ContainerClient, queue_client: QueueClient, job_id: str) -> Dict[str, List[str]]:
    logging.info(f"Generating tiles for latitude: {latitude}, longitude: {longitude}, radius: {radius_meters} meters")

    """Generate tiles for a given latitude, longitude, and radius, and upload them to Azure Blob Storage."""
    target_zoom = 19
    radius_pixels = meters_to_pixels(radius_meters, latitude, target_zoom)
    stitched_image_size = radius_pixels * 2
    center_x_tile, center_y_tile = lat_lon_to_tile(latitude, longitude, target_zoom)

    # center_pixel_x = ((longitude + 180.0) / 360.0 * (2 ** target_zoom) % 1) * 256
    # center_pixel_y = ((1 - math.log(math.tan(math.radians(latitude)) + 1 / math.cos(math.radians(latitude))) / math.pi) / 2 * (2 ** target_zoom) % 1) * 256

    stitched_image = Image.new('RGB', (stitched_image_size, stitched_image_size))
    start_x = center_x_tile - stitched_image_size // (2 * 256)
    start_y = center_y_tile - stitched_image_size // (2 * 256)

    x_range = range(start_x, start_x + stitched_image_size // 256 + 1)
    y_range = range(start_y, start_y + stitched_image_size // 256 + 1)

    logging.info(f"Fetching tiles for x_range: {x_range}, y_range: {y_range}")

    tiles_progress = 0
    tile_dir = job_id
    os.makedirs(tile_dir, exist_ok=True)

    tile_paths = []

    for x in range(start_x, start_x + stitched_image_size // 256 + 1):
        for y in range(start_y, start_y + stitched_image_size // 256 + 1):
            tile_path = await fetch_tile(session, x, y, target_zoom, tile_dir)
            if tile_path:
                tile_paths.append((tile_path, ((x - start_x) * 256, (y - start_y) * 256)))
                tiles_progress += 1
                logging.info(f"Progress: {tiles_progress}/{len(x_range) * len(y_range)}")
                gc.collect()

    logging.info("Done fetching tiles. Stitching image.")

    for tile_path, paste_position in tile_paths:
        tile_image = Image.open(tile_path)
        stitched_image.paste(tile_image, paste_position)
        tile_image.close()
        gc.collect()

    logging.info("Applying circular mask and splitting into smaller tiles")

    center = (stitched_image_size // 2, stitched_image_size // 2)
    stitched_image = apply_circular_mask(stitched_image, center, radius_pixels)

    logging.info("Applied circular mask to stitched image.")

    tile_size_pixels = int(310 / 0.2986)
    split_tile_paths = split_image(stitched_image, tile_size_pixels, tile_dir)
    stitched_image.close()
    gc.collect()

    tiles_length = len(split_tile_paths)

    logging.info(f"Uploading {tiles_length} tiles to Azure Blob Storage.")

    upload_tasks = []
    for tile_path in split_tile_paths:
        filename = os.path.basename(tile_path)
        tile = Image.open(tile_path)
        upload_tasks.append(upload_image_to_blob(tile, filename, container_client, queue_client))
        gc.collect()

    await asyncio.gather(*upload_tasks)

    # remove the tile directory
    shutil.rmtree(tile_dir)

    logging.info("All tiles uploaded to Azure Blob Storage.")

    job = set_total_images(job_id, tiles_length)

    # Call the processing API to start processing the images
    params = {
        "job_id": job_id
    }
    response = requests.post(f"http://roof-detection-processing-api:8000/process/", params=params)

    logging.info(f"Processing API response: {response.json()}")

    return {"message": f"Sattelite images generated for job: {job.id}", "totalImages": job.total_images}
