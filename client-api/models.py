from pydantic import BaseModel

class ModelRequest(BaseModel):
    latitude: float
    longitude: float
    radius: int