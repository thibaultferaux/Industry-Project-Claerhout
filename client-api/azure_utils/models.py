from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime

class Job(BaseModel):
    id: str
    status: Literal['error', 'generating', 'processing', 'completed']
    coordinates: tuple[float, float]
    radius: int
    email: str
    createdAt: datetime = datetime.now()
    totalImages: int = 0
    imagesProcessed: int = 0
    totalFlatRoofs: int = 0
    totalSlopedRoofs: int = 0
    totalSurfaceAreaFlatRoofs: float = 0
    totalSurfaceAreaSlopedRoofs: float = 0
    totalCircumferenceFlatRoofs: float = 0
    ratioFlatRoofs: float = 0
