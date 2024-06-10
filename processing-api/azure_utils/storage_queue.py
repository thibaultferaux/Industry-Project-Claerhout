from azure.storage.queue import QueueServiceClient, QueueClient
import os
from dotenv import load_dotenv
import logging

load_dotenv(override=True)

connection_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')

queue_service_client = QueueServiceClient.from_connection_string(connection_str)

def get_queue_client(queue_name: str) -> QueueClient:
    return queue_service_client.get_queue_client(queue_name)

async def fetch_urls_from_queue(queue_client: QueueClient, batch_size: int = 5):
    try:
        messages = queue_client.receive_messages(max_messages=batch_size, visibility_timeout=30)
        urls = []
        for message in messages:
            urls.append(message.content)
            queue_client.delete_message(message)
        return urls
    except Exception as e:
        logging.error(f"Error fetching urls from queue: {e}")
        return []

def receive_job_from_queue(queue_client: QueueServiceClient):
    message = queue_client.peek_messages(max_messages=1)
    return message

def delete_job_from_queue(queue_client: QueueServiceClient):
    message = queue_client.receive_message()
    queue_client.delete_message(message)
    return