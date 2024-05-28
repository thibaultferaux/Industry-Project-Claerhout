from pydantic import BaseModel

class ProcessResult(BaseModel):
    flat_roofs: int
    sloped_roofs: int
    surface_area_flat_roofs: float
    surface_area_sloped_roofs: float
    circumference_flat_roofs: float
    error: str = None