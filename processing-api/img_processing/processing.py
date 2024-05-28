from typing import List, Dict, Any

from img_processing.models import ProcessResult

def handle_image_batch(image_batch: List[str]) -> Dict[str, Any]:
    try:
        total_flat_roofs = 0
        total_sloped_roofs = 0
        total_surface_area_flat_roofs = 0
        total_surface_area_sloped_roofs = 0
        total_circumference_flat_roofs = 0

        for image in image_batch:
            # Load the image into the model and get the results
            results = process_image(image)


    except Exception as e:
        return {"error": str(e)}

def process_image(image: str) -> ProcessResult:
    pass
    # Load the image into the model and get the results