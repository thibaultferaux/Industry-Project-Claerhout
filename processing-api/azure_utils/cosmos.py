import os
import json
import logging
from azure.cosmos import CosmosClient
from dotenv import load_dotenv
from typing import Literal

from img_processing.models import GroupResults
from azure_utils.models import Job

load_dotenv()

# initialize the Cosmos client
cosmos_client = CosmosClient(os.getenv("COSMOS_DB_URI"), credential=os.getenv("COSMOS_DB_KEY"))
database_name = "roof-detection"
container_name = "jobs"
container = cosmos_client.get_database_client(database_name).get_container_client(container_name)

async def update_job_results(job_id: str, results: GroupResults, amount: int):
    logging.info(f"Updating job with id: {job_id}")
    job = container.read_item(item=job_id, partition_key=job_id)
    print("RETURNED JOB", job)
    # convert job to Job
    job = Job(**job)
    print("OLD JOB", job)
    print("RESULTS", results)
    job.add_results(results)
    job.imagesProcessed += amount
    job_json = job.model_dump_json()
    print("NEW JOB", job_json)
    result = container.upsert_item(json.loads(job_json))
    return result

async def set_job_status(job_id: str, status: Literal['error', 'generating', 'processing', 'completed']):
    logging.info(f"Setting job with id: {job_id} to completed")
    job = container.read_item(item=job_id, partition_key=job_id)
    job = Job(**job)
    job.status = status
    job_json = job.model_dump_json()
    result = container.upsert_item(json.loads(job_json))
    return result

