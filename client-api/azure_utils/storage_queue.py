from azure.storage.queue import QueueServiceClient, BinaryBase64EncodePolicy
import os
import glob
import base64
from dotenv import load_dotenv

load_dotenv(override=True)

connection_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')

queue_service_client = QueueServiceClient.from_connection_string(connection_str)
queue_client = queue_service_client.get_queue_client("image-queue")

def create_storage_queue(queue_name:str) -> QueueServiceClient:
    return queue_service_client.create_queue(queue_name)