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

from image_generation.utils import meters_to_pixels, lat_lon_to_tile
from azure_utils.blob_storage import upload_image_to_blob
from azure_utils.cosmos import set_total_images

logging.basicConfig(level=logging.INFO)

load_dotenv()

azure_maps_key = os.getenv('AZURE_MAPS_KEY')

async def fetch_tile(x: float, y: float, zoom: int) -> np.ndarray:
    """Fetch a map tile from Azure Maps."""
    url = f"https://atlas.microsoft.com/map/tile?subscription-key={azure_maps_key}&api-version=2022-08-01&tilesetId=microsoft.imagery&zoom={zoom}&x={x}&y={y}&format=png"
    response = await asyncio.to_thread(requests.get, url)
    if response.status_code == 200:
        with Image.open(BytesIO(response.content)) as img:
            return np.asarray(img)
    return None

def apply_circular_mask(array: np.ndarray, center: Tuple[int, int], radius: int) -> np.ndarray:
    """Apply a black circular mask to the image."""
    # Create a mask with the same size as the image, filled with white
    y, x = np.ogrid[:array.shape[0], :array.shape[1]]
    mask = (x - center[0]) ** 2 + (y - center[1]) ** 2 > radius ** 2
    array[mask] = 0
    return array

def split_image(mmap_array, tile_size: int) -> List[np.ndarray]:
    """Split a large image into smaller tiles."""
    tiles = []
    num_tiles_x = mmap_array.shape[1] // tile_size
    num_tiles_y = mmap_array.shape[0] // tile_size
    for x in range(num_tiles_x):
        for y in range(num_tiles_y):
            tile = mmap_array[y * tile_size: (y + 1) * tile_size, x * tile_size: (x + 1) * tile_size]
            if tile.any():  # Check if tile is not completely empty
                tiles.append(tile.copy())
            # explicitly call garbage collector to avoid memory issues
            gc.collect()

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

    mmap_file = np.memmap('stitched_image.dat', dtype=np.uint8, mode='w+', shape=(stitched_image_size, stitched_image_size, 3))

    start_x = center_x_tile - stitched_image_size // (2 * 256)
    start_y = center_y_tile - stitched_image_size // (2 * 256)

    x_range = range(start_x, start_x + stitched_image_size // 256 + 1)
    y_range = range(start_y, start_y + stitched_image_size // 256 + 1)

    logging.info(f"Fetching tiles for x_range: {x_range}, y_range: {y_range}")

    tiles_progress = 0

    for x in range(start_x, start_x + stitched_image_size // 256 + 1):
        for y in range(start_y, start_y + stitched_image_size // 256 + 1):
            tile_array = await fetch_tile(x, y, target_zoom)
            if tile_array is not None:
                tiles_progress += 1
                logging.info(f"Progress: {tiles_progress}/{len(x_range) * len(y_range)}")
                # Calculate the exact position in mmap_file for the tile_array
                tile_start_x = (x - start_x) * 256
                tile_end_x = min(tile_start_x + min(tile_array.shape[1], 256), mmap_file.shape[1])
                tile_start_y = (y - start_y) * 256
                tile_end_y = min(tile_start_y + min(tile_array.shape[0], 256), mmap_file.shape[0])

                logging.info(f"Tile start_x: {tile_start_x}, tile_end_x: {tile_end_x}, tile_start_y: {tile_start_y}, tile_end_y: {tile_end_y}, mmap_file shape: {mmap_file.shape}")

                mmap_file[tile_start_y: tile_end_y, tile_start_x: tile_end_x] = tile_array[:tile_end_y - tile_start_y, :tile_end_x - tile_start_x]
                gc.collect()

    logging.info("Done fetching tiles. Applying circular mask and splitting into smaller tiles.")

    center = (stitched_image_size // 2, stitched_image_size // 2)
    mmap_file = apply_circular_mask(mmap_file, center, radius_pixels)

    logging.info("Applied circular mask to stitched image.")

    tile_size_pixels = int(310 / 0.2986)
    tiles = split_image(mmap_file, tile_size_pixels)

    del mmap_file
    gc.collect()

    logging.info(f"Uploading {len(tiles)} tiles to Azure Blob Storage.")

    tiles_length = len(tiles)

    upload_tasks = []
    for idx, tile in enumerate(tiles):
        filename = f'tile_{idx}.png'
        upload_tasks.append(upload_image_to_blob(tile, filename, container_client, queue_client))
        # explicitly call garbage collector to avoid memory issues
        gc.collect()

    await asyncio.gather(*upload_tasks)

    logging.info("All tiles uploaded to Azure Blob Storage.")

    job = set_total_images(job_id, tiles_length)

    # Call the processing API to start processing the images
    params = {
        "job_id": job_id
    }
    response = requests.post(f"http://roof-detection-processing-api:8000/process/", params=params)

    logging.info(f"Processing API response: {response.json()}")

    return {"message": f"Sattelite images generated for job: {job.id}", "totalImages": len(tiles)}
