from typing import List, Dict, Any, Union
from ultralytics import YOLO
import logging
import torch
import numpy as np
import cv2
from PIL import Image
from datetime import datetime
import uuid
from azure.storage.blob import ContainerClient

from img_processing.models import ProcessResult, GroupResults
from img_processing.utils import pixels_to_meters, square_pixels_to_meters
from azure_utils.blob_storage import upload_result_image

# Load the YOLO model
model = YOLO("./model/best.pt")

async def handle_image_batch(image_batch: List[str], container_client: ContainerClient) -> Union[Dict[str, Any], GroupResults]:
    try:
        group_results = GroupResults()

        logging.info(f"Processing image batch: {image_batch}")
        results = model(image_batch, retina_masks=True, stream=True)

        for result in results:
            image_array = result.plot()
            image = Image.fromarray(image_array)
            filename = f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}-{uuid.uuid4()}.png"
            await upload_result_image(container_client, image, filename)

            # Check if the results contains any roofs
            if (result.masks is not None):
                try:
                    # Iterate through detected boxes and sum mask areas
                    logging.info(f"Calculating surface area and amount of roofs")
                    for idx, box in enumerate(result.boxes.cpu()):
                        label = result.names[int(box.data.numpy()[0, 5])]
                        # Access the data attribute of the mask and ensure it is converted to numpy array
                        mask_data = result.masks[idx].cpu().data
                        if isinstance(mask_data, torch.Tensor):
                            mask_data = mask_data.squeeze(0).numpy()
                        # Calculate area of the mask: sum of all 1's in the mask array
                        mask_area = np.sum(mask_data)
                        # Increment area sum based on roof type and count the number of roofs of each type
                        if label == 'flat':
                            group_results.total_flat_roofs += 1
                            group_results.total_surface_area_flat_roofs += square_pixels_to_meters(mask_area)
                        elif label == 'sloped':
                            group_results.total_sloped_roofs += 1
                            group_results.total_surface_area_sloped_roofs += square_pixels_to_meters(mask_area)

                    logging.debug(f"Results after calculating surface area and amount of roofs: {group_results.model_dump()}")

                    logging.info(f"Calculating circumference of flat roofs")
                    # filter the results so only the flat roofs remain
                    result.masks = result.masks[result.boxes.cls == 0]
                    result.boxes = result.boxes[result.boxes.cls == 0]

                    perimeters = []
                    # Calculate the perimeter of the image
                    for mask in result.masks.cpu().data.numpy():
                        contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

                        for contour in contours:
                            perimeters.append(cv2.arcLength(contour, True))

                    #sum of all the perimeters of this image and add them to the total circumference of flat roofs
                    group_results.total_circumference_flat_roofs += pixels_to_meters(sum(perimeters))

                    logging.debug(f"Results after calculating circumference of flat roofs: {group_results.model_dump()}")

                except Exception as e:
                    logging.error(f"Error processing image {result.path} - error message: {str(e)}")

        logging.debug(f"Final results: {group_results.model_dump()}")

        return group_results

    except Exception as e:
        return {"error": str(e)}

def process_image(image: str) -> ProcessResult:
    logging.info(f"Processing image: {image}")
    return ProcessResult(
        flat_roofs=1,
        sloped_roofs=1,
        surface_area_flat_roofs=1,
        surface_area_sloped_roofs=1,
        circumference_flat_roofs=1
    )