from pydantic import BaseModel

class ProcessResult(BaseModel):
    flat_roofs: int
    sloped_roofs: int
    surface_area_flat_roofs: float
    surface_area_sloped_roofs: float
    circumference_flat_roofs: float
    error: str = None

class GroupResults(BaseModel):
    total_flat_roofs: int = 0
    total_sloped_roofs: int = 0
    total_surface_area_flat_roofs: float = 0
    total_surface_area_sloped_roofs: float = 0
    total_circumference_flat_roofs: float = 0

    def add_results(self, results: ProcessResult):
        self.total_flat_roofs += results.flat_roofs
        self.total_sloped_roofs += results.sloped_roofs
        self.total_surface_area_flat_roofs += results.surface_area_flat_roofs
        self.total_surface_area_sloped_roofs += results.surface_area_sloped_roofs
        self.total_circumference_flat_roofs += results.circumference_flat_roofs