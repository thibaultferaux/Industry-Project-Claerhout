from fastapi import FastAPI
from ultralytics import YOLO
import numpy as np
import cv2
import glob
import torch
import json
import logging

app = FastAPI()

# Load the YOLO model
model = YOLO("./model/best.pt")
logging.basicConfig(level=logging.INFO,format='%(asctime)s - %(levelname)s - %(message)s')

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