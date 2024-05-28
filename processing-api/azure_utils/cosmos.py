import os
from azure.cosmos import CosmosClient
from dotenv import load_dotenv

load_dotenv()

# initialize the Cosmos client
cosmos_client = CosmosClient(os.getenv("COSMOS_DB_URI"), credential=os.getenv("COSMOS_DB_KEY"))
database_name = "roof-detection"
container_name = "jobs"
container = cosmos_client.get_database_client(database_name).get_container_client(container_name)
