import os
from qdrant_client.models import ScoredPoint
from load_clients import load_openai_client, load_qdrant_client, load_deployment_name

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides the functions for embedding
            user queries and retreviving results and generating
            responses from the data stored in the qdrant
            database
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: get_query_embedding
IMPORT: query_text, embedding_selection
EXPORT: embedding
PURPOSE: gets the vector embedding for the user query
        so a response for the query can be matched 
        in the vector database. the embedding_selection
        ensures different deployments are used for
        different features
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_query_embedding(query_text, embedding_selection):
    embeddings_response = load_openai_client().embeddings.create(
        model=os.getenv(embedding_selection),
        input=[query_text]
    )
    embedding = embeddings_response.data[0].embedding
    return embedding


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: query_qdrant
IMPORT: query_text, embedding_selection
EXPORT: documents
PURPOSE: returns the closest matched results from the
        vector database, based on the generated
        embedding from the users query and then
        extracts the documents from the serch results
'''''''''''''''''''''''''''''''''''''''''''''''''''
def query_qdrant(query_text, embedding_selection):
    query_embedding = get_query_embedding(query_text, embedding_selection)
    
    search_result = load_qdrant_client().search( #perform vector similarity search in qdrant database
        collection_name="E2cluster1",
        query_vector=query_embedding,
        limit=5  #number of top results to retrieve
    )
    
    documents = []
    for point in search_result:
        if isinstance(point, ScoredPoint) and hasattr(point, 'payload') and 'content' in point.payload:
            documents.append(point.payload['content'])
        else:
            print(f"Skipping point due to missing payload or content: {point}")
    
    return documents


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: get_llm_response
IMPORT: messages, max_response_tokens
EXPORT: response
PURPOSE: gets the response from the LLM with the 
        prompt engineering included. also includes
        all the response hyperparameters that can
        be tuned 
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_llm_response(messages, max_response_tokens):
    try:
        response = load_openai_client().chat.completions.create(
            model=load_deployment_name(),  
            messages=messages,
            max_tokens=max_response_tokens, #set a limit on the number of tokens per model response
            temperature=0.7, #controls randomness. Lowering = produce more repetitive and deterministic responses. Increasing = more unexpected or creative responses. Try adjusting temperature or Top P but not both.
            top_p=0.9, #also controls randomness. Lowering = narrow token selection to likelier tokens. Increasing = model choose from tokens with both high and low likelihood.
            frequency_penalty=0, #decreases the likelihood of repeating the exact same text in a response.
            presence_penalty=0, #increases the likelihood of introducing new topics in a response.
            stop=None #Make the model end its response at a desired point. 
        )
        return response
    
    except AttributeError as e:
        print("Error accessing response:", e)
        return "An error occurred while generating the response."
    
    