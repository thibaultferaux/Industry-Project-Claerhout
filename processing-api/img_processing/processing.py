from typing import List, Dict, Any, Union
from ultralytics import YOLO
import logging

from img_processing.models import ProcessResult, GroupResults

# Load the YOLO model
model = YOLO("../model/best.pt")

def handle_image_batch(image_batch: List[str]) -> Union[Dict[str, Any], GroupResults]:
    try:
        group_results = GroupResults()

        for image in image_batch:
            # Load the image into the model and get the results
            results = process_image(image)
            print("IMAGE RESULT", results)
            group_results.add_results(results)

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