import os
from openai import AzureOpenAI
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from azure.storage.blob import BlobServiceClient

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project
            This file loads the clients for openai, qdrant,
            gpt model, and the blob storage
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

load_dotenv()

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: load_openai_client
IMPORT: none
EXPORT: openai_client
PURPOSE: load the client for Azure openai
'''''''''''''''''''''''''''''''''''''''''''''''''''
def load_openai_client():
    openai_client = AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version="2024-02-01"
    )
    return openai_client


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: load_deployment_name
IMPORT: none
EXPORT: deployment_name
PURPOSE: load the gpt model
'''''''''''''''''''''''''''''''''''''''''''''''''''
def load_deployment_name():
    deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
    return deployment_name


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: load_qdrant_client
IMPORT: none
EXPORT: qdrant_client
PURPOSE: load the client for the qdrant cloud
'''''''''''''''''''''''''''''''''''''''''''''''''''
def load_qdrant_client():
    qdrant_client = QdrantClient(
        url=os.getenv("QDRANT_CLOUD_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )
    return qdrant_client


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: load_blob_client
IMPORT: none
EXPORT: container_client
PURPOSE: load the client for the Azure blob storage
'''''''''''''''''''''''''''''''''''''''''''''''''''
def load_blob_client():
    blob_service_client = BlobServiceClient.from_connection_string(os.getenv("AZURE_STORAGE_CONNECTION_STRING"))
    container_client = blob_service_client.get_container_client(os.getenv("CONTAINER_NAME"))
    return container_client