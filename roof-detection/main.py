from fastapi import FastAPI
from ultralytics import YOLO
import numpy as np
import cv2
import glob

app = FastAPI()

model = YOLO("./model/best.pt")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/perimeter/")
async def get_permiter():
    directory = "./test-images/"
    images = glob.glob(directory + "*.jpg")
    results = model(images, classes=[0], retina_masks=True)
    perimeters = []
    for result in results:
        if(result.masks is not None):
            masks_cpu = result.masks.cpu()
            masks_numpy = masks_cpu.data.numpy()

            for mask in masks_numpy:
                mask_uint8 = mask.astype(np.uint8)

                contours, _ = cv2.findContours(mask_uint8, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

                for contour in contours:
                    perimeter = cv2.arcLength(contour, True)
                    perimeters.append(perimeter)

    total_perimeter = sum(perimeters)

    pixels_per_meter = 298 / 30
    total_perimeter_meters = total_perimeter / pixels_per_meter
    return {"total_perimeter": total_perimeter_meters}

@app.get("/surface-area/")
async def get_surface_area():
    directory = "./test-images/"
    images = glob.glob(directory + "*.jpg")
    results = model(images, classes=[0], retina_masks=True)
    surface_areas = []
    for result in results:
        if(result.masks is not None):
            masks_cpu = result.masks.cpu()
            masks_numpy = masks_cpu.data.numpy()
            flat_areas =[np.sum(mask) for mask in masks_numpy]
            flat_surface_areas = [area * 1.0 for area in flat_areas]
            total_surface_area = sum(flat_surface_areas)
            surface_areas.append(total_surface_area)
    pixels_per_meter = 298 / 30 

    pixels_per_square_meter = pixels_per_meter ** 2

    total_surface_areas = sum(surface_areas)

    total_surface_area_meter = total_surface_areas / pixels_per_square_meter

    print(f"Surface areas for 'flat' class (in m²): {total_surface_area_meter}")
    return {"total_surface_area": total_surface_area_meter}

@app.get("/ratio/")
async def get_ratio():
    pass

@app.get("/roofs/")
async def get_roofs():
    pass