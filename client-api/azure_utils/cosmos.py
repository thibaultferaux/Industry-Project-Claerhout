import os
import uuid
from datetime import datetime
from azure.cosmos import CosmosClient
from azure_utils.models import Job
import json
from dotenv import load_dotenv
import logging

load_dotenv(override=True)

# initialize the Cosmos client
cosmos_client = CosmosClient(os.getenv("COSMOS_DB_URI"), credential=os.getenv("COSMOS_DB_KEY"))
database_name = "roof-detection"
container_name = "jobs"
container = cosmos_client.get_database_client(database_name).get_container_client(container_name)

def create_job(coordinates:tuple[float, float], radius:int,email:str) -> Job:
    # create a new job
    job = Job(id=str(uuid.uuid4()), status="generating", coordinates=coordinates, radius=radius,email=email)

    # create a new item
    job_json = job.model_dump_json()
    container.create_item(json.loads(job_json))

    return job

def set_total_images(job_id:str, total_images:int) -> Job:
    # get the job from the Cosmos DB
    job = container.read_item(item=job_id, partition_key=job_id)
    job['totalImages'] = total_images
    job['status'] = "processing"

    # update the job in the Cosmos DB
    logging.debug(f"Job before insert: {job}")
    result = container.upsert_item(job)
    logging.debug(f"Result after upsert: {result}")
    return Job(**job)

def get_job(job_id:str) -> Job:
    # get the job from the Cosmos DB
    job = container.read_item(item=job_id, partition_key=job_id)
    return Job(**job)