from fastapi import FastAPI
from ultralytics import YOLO
import numpy as np
import cv2
import glob
import torch
import supervision as sv

app = FastAPI()

model = YOLO("../roof-detection/model/best.pt")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/results/")
async def get_results():
    images = glob.glob("../roof-detection/test-images/" + "*.jpg")
    results = model(images,retina_masks=True)
    flat_area = 0  
    sloped_area = 0
    flat = 0
    sloped = 0
    for result in results:
        boxes = result.boxes  
        masks = result.masks  
        label_names = result.names  

        # Iterate through detected boxes and sum mask areas
        for idx, box in enumerate(boxes):
            box_data = box.data.numpy()  
            label_idx = int(box_data[0, 5])  # Access the class label index
            label = label_names[label_idx]
            
            mask = masks[idx]  
            
            # Access the data attribute of the mask and ensure it is converted to numpy array
            mask_data = mask.data 
            if isinstance(mask_data, torch.Tensor):
                mask_data = mask_data.squeeze(0).numpy()  

            # Calculate area of the mask: sum of all 1's in the mask array
            mask_area = np.sum(mask_data)

            # Increment area sum based on roof type
            if label == 'flat':
                flat += 1
                flat_area += mask_area
            elif label == 'sloped':
                sloped += 1
                sloped_area += mask_area

    # Calculate the ratio of areas
    if sloped_area > 0:  
        ratio_area_flat_to_steep = flat_area / sloped_area
    else:
        ratio_area_flat_to_steep = None

    flat_results = model(images,classes=[0],retina_masks=True)
    
    perimeters = []
    surface_areas = []
    for result in flat_results:
        if(result.masks is not None):
            masks_cpu = result.masks.cpu()
            masks_numpy = masks_cpu.data.numpy()

            for mask in masks_numpy:
                mask_uint8 = mask.astype(np.uint8)

                contours, _ = cv2.findContours(mask_uint8, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

                for contour in contours:
                    perimeter = cv2.arcLength(contour, True)
                    perimeters.append(perimeter)
        
            flat_areas =[np.sum(mask) for mask in masks_numpy]
            flat_surface_areas = [area * 1.0 for area in flat_areas]
            total_surface_area = sum(flat_surface_areas)
            surface_areas.append(total_surface_area)

    total_perimeter = sum(perimeters)
    pixels_per_meter = 298 / 30
    pixels_per_square_meter = pixels_per_meter ** 2
    total_perimeter_meters = total_perimeter / pixels_per_meter
    total_surface_areas = sum(surface_areas)
    total_surface_area_meter = total_surface_areas / pixels_per_square_meter

    return {"ratio_area_flat_to_steep": ratio_area_flat_to_steep, "flat_area": flat_area, "sloped_area": sloped_area, "flat_roofs": flat, "sloped_roofs": sloped, "total_perimeter_flat": total_perimeter_meters, "total_surface_area_flat": total_surface_area_meter}