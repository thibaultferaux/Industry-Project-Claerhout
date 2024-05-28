from azure.storage.queue import QueueServiceClient, BinaryBase64EncodePolicy
import os
import glob
import base64
from dotenv import load_dotenv

load_dotenv(override=True)

connection_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')

queue_service_client = QueueServiceClient.from_connection_string(connection_str)
queue_client = queue_service_client.get_queue_client("image-queue")

# put images from ../tiles to the queue (use base64 encoding)
for filename in glob.glob("./tiles/*.png"):
    with open(filename, "rb") as image:
        content = image.read()
        base64_image = base64.b64encode(content).decode('utf-8')
        queue_client.send_message(base64_image)