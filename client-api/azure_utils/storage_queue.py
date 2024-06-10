from azure.storage.queue import QueueServiceClient
import os
from dotenv import load_dotenv

load_dotenv(override=True)

connection_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')

queue_service_client = QueueServiceClient.from_connection_string(connection_str)

def create_storage_queue(queue_name:str) -> QueueServiceClient:
    return queue_service_client.create_queue(f"job-{queue_name}")

async def store_job_in_queue(job_id:str):
    queue_client = queue_service_client.get_queue_client("jobs")
    queue_client.send_message(job_id)

    # remove queue_client
    del queue_client

    return