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
        azure_endpoint="https://austest2dp.openai.azure.com/",
        api_key="33ea5702df134f8bb0ec4d2181b5bedd",
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
    deployment_name = "AUS35Test3"
    return deployment_name


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: load_qdrant_client
IMPORT: none
EXPORT: qdrant_client
PURPOSE: load the client for the qdrant cloud
'''''''''''''''''''''''''''''''''''''''''''''''''''
def load_qdrant_client():
    qdrant_client = QdrantClient(
        url="https://ef32f0bc-42ee-4576-85a2-8634285b097a.us-east4-0.gcp.cloud.qdrant.io",
        api_key="sgs0_d_VCt7zy6bpP3Ev42D0Ib6wIlMLMx-VuF5cxhL0xAQEgEGhGA"
    )
    return qdrant_client


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: load_blob_client
IMPORT: none
EXPORT: container_client
PURPOSE: load the client for the Azure blob storage
'''''''''''''''''''''''''''''''''''''''''''''''''''
def load_blob_client():
    blob_service_client = BlobServiceClient.from_connection_string("DefaultEndpointsProtocol=https;AccountName=stockdatascrape;AccountKey=Sg1ioSfzwWybd5qh1C15IS1TmuhAaDDEAvajAybblFYKqMPE6qyPbzb4u4a1B0G+ES8fo4pAieFH+ASt/D17bQ==;EndpointSuffix=core.windows.net")
    container_client = blob_service_client.get_container_client("stockdata")
    return container_client