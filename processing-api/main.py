import math
import os
from tkinter import Image
from fastapi import FastAPI
from ultralytics import YOLO
import numpy as np
import cv2
import glob
import torch
import json
import logging
from PIL import Image, ImageDraw
import requests
from io import BytesIO

app = FastAPI()

# Load the YOLO model
model = YOLO("./model/best.pt")
logging.basicConfig(level=logging.INFO,format='%(asctime)s - %(levelname)s - %(message)s')

# Functions to split tiles
def lat_lon_to_tile(latitude, longitude, zoom):
    lat_rad = math.radians(latitude)
    n = 2.0 ** zoom
    xtile = int((longitude + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.log(math.tan(lat_rad) + (1 / math.cos(lat_rad))) / math.pi) / 2.0 * n)
    return xtile, ytile

def meters_to_pixels(radius_meters, latitude, zoom_level):
    meters_per_pixel = 156543.03392 * math.cos(latitude * math.pi / 180) / (2 ** zoom_level)
    return int(radius_meters / meters_per_pixel)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/results/")
async def get_results():
    coordinates = "brussel" # has to be replaced with parameter from front-end
    # code to generate images around coordinates



    #retrieve all images
    try:
        images = glob.glob("./images/" + "*.jpg")
        logging.info(f"{len(images)} images retrieved")
    except Exception as e:
        logging.error("Error retrieving images - error message:" + str(e))
    #set all data to 0
    flat_area = 0
    sloped_area = 0
    flat = 0
    sloped = 0
    total_perimeter_list = []
    total_surface_area_list = []
    #iterate through all images
    for image in images:
        try:
            # Load the image into the model and get the results
            results = model(image,retina_masks=True)
            # Check if the results contains any roofs
            if(results[0].masks is not None):
                # Iterate through detected boxes and sum mask areas
                for idx, box in enumerate(results[0].boxes):
                    label = results[0].names[int(box.data.numpy()[0, 5])]
                    # Access the data attribute of the mask and ensure it is converted to numpy array
                    mask_data = results[0].masks[idx].data
                    if isinstance(mask_data, torch.Tensor):
                        mask_data = mask_data.squeeze(0).numpy()
                    # Calculate area of the mask: sum of all 1's in the mask array
                    mask_area = np.sum(mask_data)
                    # Increment area sum based on roof type and count the number of roofs of each type
                    if label == 'flat':
                        flat += 1
                        flat_area += mask_area
                    elif label == 'sloped':
                        sloped += 1
                        sloped_area += mask_area

                # filter the results so only the flat roofs remain
                if(results[0] is not None):
                        results[0].masks = results[0].masks[results[0].boxes.cls == 0]
                        results[0].boxes = results[0].boxes[results[0].boxes.cls == 0]

                # empty data for perimeters and surface area for this image
                perimeters = []
                flat_areas = []
                # Calculate the perimeter of the image
                for mask in results[0].masks.cpu().data.numpy():
                    contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

                    for contour in contours:
                        perimeters.append(cv2.arcLength(contour, True))

                    #calculate the surface area of the image
                    flat_areas.append(np.sum(mask) * 1.0)

                #sum of all the perimeters and surface areas of this image and convert them into meters with ratio of 298 pixels to 30 meters
                total_perimeter_list.append(sum(perimeters) / (298 / 30))
                total_surface_area_list.append(sum(flat_areas) / ((298 / 30) **2))
        except Exception as e:
            logging.error(f"Error processing image {results[0].path} - error message:" + str(e))
    logging.info("images processed")
    if sloped_area > 0 and flat_area > 0:
        ratio_area_flat_to_steep = flat_area / sloped_area
    else:
        ratio_area_flat_to_steep = 0
    try:
        # Open the JSON file
        with open('results.json', 'r') as file:
            jsondata = json.load(file)

        # Add new values to the JSON object
        jsondata[coordinates] = {
            "plat hellend ratio": ratio_area_flat_to_steep,
            "plat gebied": flat_area,
            "hellend gebied": sloped_area,
            "platte daken": flat,
            "hellende daken": sloped,
            "omtrek platte daken": sum(total_perimeter_list),
            "oppervlakte platte daken": sum(total_surface_area_list)
        }

        # Write the updated JSON object back to the file
        with open('results.json', 'w') as file:
            json.dump(jsondata, file, indent=4)

        # Set the JSON object to None to free up memory
        jsondata = None
        logging.info("results saved")
    except Exception as e:
        logging.error("Error saving results - error message:" + str(e))
    return {"plat hellend ratio": ratio_area_flat_to_steep,"plat gebied": flat_area,"hellend gebied": sloped_area,"platte daken": flat,"hellende daken": sloped,"omtrek platte daken": sum(total_perimeter_list),"oppervlakte platte daken": sum(total_surface_area_list)}

@app.get("/data/")
async def get_data():
    with open('/mnt/data/results.json', 'r') as file:
        jsondata = json.load(file)
    logging.info("data retrieved")
    return jsondata

@app.post("/generate-tiles/")
async def generate_tiles(latitude: float, longitude: float, radius_meters: int):
    target_zoom = 19
    azure_maps_key = "3C8x085Q0vz4CxSijVuLX0BptJ8McmbxlLa0h13u5u9Uoiy7X970JQQJ99AEACi5YpztG4CIAAAgAZMPx2TP"
    output_dir = './tiles/'
    os.makedirs(output_dir, exist_ok=True)

    # Calculate the radius in pixels
    radius_pixels = meters_to_pixels(radius_meters, latitude, target_zoom)
    stitched_image_size = radius_pixels * 2

    # Calculate center tile and pixel offsets
    center_x_tile, center_y_tile = lat_lon_to_tile(latitude, longitude, target_zoom)
    center_pixel_x = ((longitude + 180.0) / 360.0 * (2 ** target_zoom) % 1) * 256
    center_pixel_y = ((1 - math.log(math.tan(math.radians(latitude)) + 1 / math.cos(math.radians(latitude))) / math.pi) / 2 * (2 ** target_zoom) % 1) * 256

    # Stitch tiles to create a large image
    stitched_image = Image.new('RGB', (stitched_image_size, stitched_image_size))
    start_x = center_x_tile - stitched_image_size // (2 * 256)
    start_y = center_y_tile - stitched_image_size // (2 * 256)

    for x in range(start_x, start_x + stitched_image_size // 256 + 1):
        for y in range(start_y, start_y + stitched_image_size // 256 + 1):
            url = f"https://atlas.microsoft.com/map/tile?subscription-key={azure_maps_key}&api-version=2022-08-01&tilesetId=microsoft.imagery&zoom={target_zoom}&x={x}&y={y}&format=png"
            response = requests.get(url)
            if response.status_code == 200:
                tile_image = Image.open(BytesIO(response.content))
                stitched_image.paste(tile_image, ((x - start_x) * 256, (y - start_y) * 256))

    # Apply circular mask centered on the stitched image
    center = (stitched_image_size // 2, stitched_image_size // 2)
    mask = Image.new('L', stitched_image.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((center[0] - radius_pixels, center[1] - radius_pixels, center[0] + radius_pixels, center[1] + radius_pixels), fill=255)
    stitched_image.putalpha(mask)

    # Save the stitched image result and generate tiles
    image_paths = []
    tile_size_pixels = int(310 / 0.2986)  # Make sure this is calculated only once and reused
    num_tiles_x = stitched_image_size // tile_size_pixels
    num_tiles_y = stitched_image_size // tile_size_pixels


    for x in range(num_tiles_x):
        for y in range(num_tiles_y):
            box = (x * (310 // 0.2986), y * (310 // 0.2986), (x + 1) * (310 // 0.2986), (y + 1) * (310 // 0.2986))
            tile = stitched_image.crop(box)
            tile_path = os.path.join(output_dir, f'tile_{x}_{y}.png')
            if tile.getbbox():  # Check if tile is not completely empty
                tile.save(tile_path)
                image_paths.append(tile_path)

    return {"message": "Circular area generated and saved", "files": image_paths}