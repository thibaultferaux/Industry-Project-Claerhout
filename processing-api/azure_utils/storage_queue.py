from azure.storage.queue import QueueServiceClient, QueueClient
import os
from dotenv import load_dotenv

load_dotenv(override=True)

connection_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')

queue_service_client = QueueServiceClient.from_connection_string(connection_str)

def get_queue_client(queue_name: str) -> QueueClient:
    return queue_service_client.get_queue_client(queue_name)

async def fetch_urls_from_queue(queue_client: QueueClient, batch_size: int = 5):
    messages = queue_client.receive_messages(max_messages=batch_size)
    urls = []
    for message in messages:
        urls.append(message.content)
        queue_client.delete_message(message)
    return urls