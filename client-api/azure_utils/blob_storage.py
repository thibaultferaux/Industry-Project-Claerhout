import os
from azure.storage.blob import BlobServiceClient, ContainerClient
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO

load_dotenv(override=True)

connection_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')

blob_service_client = BlobServiceClient.from_connection_string(connection_str)

def create_blob_container(container_name:str) -> ContainerClient:
    return blob_service_client.create_container(container_name)

async def upload_image_to_blob(image: Image.Image, container_client: ContainerClient, filename: str) -> None:
    blob_client = container_client.get_blob_client(filename)
    with BytesIO() as output:
        image.save(output, format='PNG')
        output.seek(0)
        blob_client.upload_blob(output.getvalue(), overwrite=True)