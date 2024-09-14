import os, re, time
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from qdrant_client.models import PointStruct
from load_clients import load_openai_client, load_qdrant_client, load_blob_client
import logging
from user_queries import normalise_vector
import numpy as np

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file creates the vector database store
            in the qdrant cloud from the scraped data
            in the Azure blob storage. this script is 
            automated in Azure Functions to ensure the
            vector database is updated daily with new
            scraped data
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    try:
        container_client = load_blob_client()
        blob_list = container_client.list_blobs()
        global_id_counter = 0  #ensure unique ids
        for blob in blob_list:
            blob_client = container_client.get_blob_client(blob.name)
            blob_content = blob_client.download_blob().readall().decode('utf-8')
            url_match = re.search(r'https://\S+', blob_content) #get the url from each file
            url = url_match.group(0) if url_match else None
            metadata = {"source": blob.name} #store the URL in metadata for later!
            if url:
                metadata["url"] = url

            doc = Document(page_content=blob_content, metadata=metadata)
            
            chunks = create_chunks([doc])
            chunk_texts = [chunk.page_content for chunk in chunks]
            embeddings = get_data_embeddings(chunk_texts)
            
            batch_size = 4  #process in batches to avoid timeout issues
            for i in range(0, len(chunks), batch_size):
                batch_chunks = chunks[i:i + batch_size]
                batch_embeddings = embeddings[i:i + batch_size]
                
                points = [
                    PointStruct(id=global_id_counter + j, vector=embedding, payload={"content": chunk.page_content, "metadata": chunk.metadata})
                    for j, (chunk, embedding) in enumerate(zip(batch_chunks, batch_embeddings))
                ]
                
                qdrant_store(points)
                global_id_counter += len(batch_chunks)
            
            print(f"Processed and uploaded file: {blob.name}")
        
        print("All files processed and uploaded successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: create_chunks
IMPORT: docs: list[Document]
EXPORT: chunks
PURPOSE: chunks the loaded documents into chunks
'''''''''''''''''''''''''''''''''''''''''''''''''''
def create_chunks(docs: list[Document]):
    try:
        textSplitter = RecursiveCharacterTextSplitter(
            chunk_size=4000, #can adjust this as needed
            chunk_overlap=20,
            length_function=len,
            add_start_index=True,
        )
        chunks = textSplitter.split_documents(docs)
        return chunks
    except Exception as e:
        print(f"Failed to create chunks: {e}")
        raise


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: get_data_embeddings
IMPORT: chunks
EXPORT: embedding_object.embedding
PURPOSE: gets the embeddings for the scraped data
        chunks
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_data_embeddings(chunk_texts):
    try:
        embeddings_response = load_openai_client().embeddings.create(
            model=os.getenv("AZURE_OPENAI_EMBEDDING_NAME"),
            input=chunk_texts
        )
        embeddings = [embedding_object.embedding for embedding_object in embeddings_response.data]
        normalized_embeddings = [normalise_vector(np.array(embedding)) for embedding in embeddings] #normalise embeddings!!
        return normalized_embeddings
    except Exception as e:
        print(f"Failed to get data embeddings: {e}")
        raise


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: qdrant_store
IMPORT: points
EXPORT: none
PURPOSE: loads all the embeddings of the scraped data
        into the qdrant vector database
'''''''''''''''''''''''''''''''''''''''''''''''''''
def qdrant_store(points):
    retry_attempts = 4
    for attempt in range(retry_attempts):
        try:
            load_qdrant_client().upsert(
                collection_name="E2cluster1",
                points=points
            )
            break  
        except Exception as e:
            print(f"Failed to store data in Qdrant (attempt {attempt + 1}/{retry_attempts}): {e}")
            if attempt < retry_attempts - 1:
                time.sleep(2 ** attempt)  
            else:
                raise


if __name__ == "__main__":
    main()
