from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime

from img_processing.models import GroupResults

class Job(BaseModel):
    id: str
    status: Literal['error', 'generating', 'processing', 'completed']
    coordinates: tuple[float, float]
    radius: int
    createdAt: datetime = datetime.now()
    totalImages: int = 0
    imagesProcessed: int = 0
    totalFlatRoofs: int = 0
    totalSlopedRoofs: int = 0
    totalSurfaceAreaFlatRoofs: float = 0
    totalSurfaceAreaSlopedRoofs: float = 0
    totalCircumferenceFlatRoofs: float = 0

    def add_results(self, results: GroupResults):
        self.totalFlatRoofs += results.total_flat_roofs
        self.totalSlopedRoofs += results.total_sloped_roofs
        self.totalSurfaceAreaFlatRoofs += results.total_surface_area_flat_roofs
        self.totalSurfaceAreaSlopedRoofs += results.total_surface_area_sloped_roofs
        self.totalCircumferenceFlatRoofs += results.total_circumference_flat_roofs