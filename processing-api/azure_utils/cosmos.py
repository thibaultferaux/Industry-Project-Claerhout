import os
import json
import logging
import uuid
from azure.cosmos import CosmosClient
from dotenv import load_dotenv
from typing import Literal

from img_processing.models import GroupResults
from azure_utils.models import Job, JobError

load_dotenv()

# initialize the Cosmos client
cosmos_client = CosmosClient(os.getenv("COSMOS_DB_URI"), credential=os.getenv("COSMOS_DB_KEY"))
database_name = "roof-detection"
job_container_name = "jobs"
job_container = cosmos_client.get_database_client(database_name).get_container_client(job_container_name)
error_container_name = "errors"
error_container = cosmos_client.get_database_client(database_name).get_container_client(error_container_name)

async def update_job_results(job_id: str, results: GroupResults, amount: int):
    logging.info(f"Updating job with id: {job_id}")
    job = job_container.read_item(item=job_id, partition_key=job_id)
    logging.debug(f"Returned job: {job}")
    # convert job to Job
    job = Job(**job)
    logging.debug(f"Old job: {job}")
    logging.debug(f"Results to add: {results}")
    job.add_results(results)
    job.imagesProcessed += amount
    job_json = job.model_dump_json()
    logging.debug(f"New job: {job_json}")
    result = job_container.upsert_item(json.loads(job_json))
    logging.debug(f"Result after upsert: {result}")
    return result

async def set_job_status(job_id: str, status: Literal['error', 'generating', 'processing', 'completed']):
    logging.info(f"Setting job with id: {job_id} to completed")
    job = job_container.read_item(item=job_id, partition_key=job_id)
    job = Job(**job)
    job.status = status
    job_json = job.model_dump_json()
    result = job_container.upsert_item(json.loads(job_json))
    return result

async def set_job_error(job_id: str, error: str):
    # create a new job error
    error = JobError(id=str(uuid.uuid4()), jobId=job_id, error=error)

    # create a new item
    error_json = error.model_dump_json()
    error_container.create_item(json.loads(error_json))

    return error

