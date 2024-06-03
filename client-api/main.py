from fastapi import FastAPI, BackgroundTasks

from azure_utils.cosmos import create_job, get_job
from azure_utils.blob_storage import create_blob_container
from azure_utils.storage_queue import create_storage_queue
from image_generation.generate_images import generate_tiles

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/detect-roofs/")
async def detect_roofs(latitude: float, longitude: float, radius_meters: int, background_tasks: BackgroundTasks):
    coordinates = (latitude, longitude)

    try:
        # Create new job in Cosms DB
        job = create_job(coordinates, radius_meters)

        # Create blob container in Azure Storage
        container_client = create_blob_container(job.id)

        # Create storage queue in Azure Storage
        queue_client = create_storage_queue(job.id)
    except Exception as e:
        return {"message": f"Error creating job: {e}"}

    background_tasks.add_task(generate_tiles, latitude, longitude, radius_meters, container_client, queue_client, job.id)

    return {"message": "Job created", "jobId": job.id}

@app.get("/job-status/{job_id}")
async def job_status(job_id: str):
    job = get_job(job_id)
    return job