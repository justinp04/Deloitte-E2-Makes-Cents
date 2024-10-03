import os, string
from qdrant_client.models import ScoredPoint
from load_clients import load_openai_client, load_qdrant_client, load_deployment_name
from qdrant_client.models import ScoredPoint, Filter, Match, FieldCondition, MatchText
import numpy as np

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
def get_query_embedding(query_text):
    try:
        embeddings_response = load_openai_client().embeddings.create(
            model=os.getenv("AZURE_OPENAI_EMBEDDING_NAME"),
            input=[query_text]
        )
        embedding = embeddings_response.data[0].embedding
        normalised_embedding = normalise_vector(np.array(embedding)) #normalise the embedding!
        return normalised_embedding
    except Exception as e:
        print(f"Failed to get data embeddings: {e}")
        raise


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: search_for_stock_summary
IMPORT: stock_name, query_text
EXPORT: final_documents
PURPOSE: uses hybrid based searching to return 
        relevant documents from Qdrant
'''''''''''''''''''''''''''''''''''''''''''''''''''
def search_for_stock_summary(stock_name, query_text):
    # print(stock_name)

    stock_vector = get_query_embedding(query_text)

    source_filter = Filter( #create filter based on source name
        must=[
            FieldCondition(
                key="source",
                match=MatchText(text=stock_name)
            )
        ]
    )
    
    search_result, next_page = load_qdrant_client().search( #use search to retrieve all matching vectors
        collection_name="E2cluster1",
        query_vector=stock_vector,
        scroll_filter=source_filter,
        limit=21  #can adjust - keep high to avoid missing points 
    )

    final_documents = []
    for point in search_result:
        document = {
            'content': point.payload.get('content', 'No content available'),
            'metadata': {
                'source': point.payload.get('source', 'No source available'),
                'url': point.payload.get('url', 'No URL available')
            }
        }
        final_documents.append(document)  # This should be inside the loop
    
    return final_documents
    

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: search_for_stock_chatbot
IMPORT: stock_name, query_text
EXPORT: final_documents
PURPOSE: uses hybrid based searching to return 
        relevant documents from Qdrant
'''''''''''''''''''''''''''''''''''''''''''''''''''
def search_for_stock_chatbot(stock_name, query_text):
    # print(stock_name)

    stock_vector = get_query_embedding(query_text)
    query_text_cleaned = query_text.replace('?', '').replace('.', '').replace(',', '') #remove some punctuation
    key_terms = query_text_cleaned.split() #split the user query terms for semantic search

    keyword_conditions = [
        FieldCondition(
            key="content",
            match=MatchText(text=term) #condition to check to match user query terms in Qdrant points
        )
        for term in key_terms
    ]

    source_filter = Filter(
        must=[
            Filter(  #sub-filter to implement OR logic within the 'must' filter for source name search
                should=[
                    FieldCondition(
                        key="source",
                        match=MatchText(text=f"{stock_name}-")  
                    ),
                    FieldCondition(
                        key="source",
                        match=MatchText(text=f"{stock_name}_")  
                    )
                ]
            )
        ],
        should=keyword_conditions  #should filter: match any of the key terms in the content
    )
    
    search_result, next_page = load_qdrant_client().search( #use search to retrieve all matching vectors
        collection_name="E2cluster1",
        query_vector=stock_vector,
        scroll_filter=source_filter,
        limit=20  #can adjust - keep high to avoid missing points 
    )

    final_documents = []
    for point in search_result:
        document = {
            'content': point.payload.get('content', 'No content available'),
            'metadata': {
                'source': point.payload.get('source', 'No source available'),
                'url': point.payload.get('url', 'No URL available')
            }
        }
        final_documents.append(document)  # This should be inside the loop
    
    return final_documents


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: query_qdrant
IMPORT: query_text, embedding_selection
EXPORT: documents
PURPOSE: returns the closest matched results from the
        vector database, based on the generated
        embedding from the users query and then
        extracts the documents from the serch results
'''''''''''''''''''''''''''''''''''''''''''''''''''
def query_qdrant(query_text, stock_name):
    query_embedding = get_query_embedding(query_text)
    
    search_result = load_qdrant_client().search(
        collection_name="E2cluster1",
        query_vector=query_embedding, 
        limit=10  # Adjust as needed
    )

    # print("Raw search results:", search_result) #debug
    
    stock_name = stock_name.strip()

    filtered_results = []
    for point in search_result:
        if isinstance(point, ScoredPoint) and hasattr(point, 'payload'):
            payload = point.payload
            metadata = payload.get('metadata', {})
            source = metadata.get('source', '')

            # print(f"Checking source: '{source}'") #debug

            if (source.startswith(f"{stock_name}") or #check for both formats
                f"Financial-Statement-{stock_name}.md" in source): 
                filtered_results.append(point)
    
    # print("Filtered results:", filtered_results) #debug
    
    final_documents = []
    for point in filtered_results:
        # print("Processing document:", point.payload) #debug
        
        document = {
            'content': point.payload.get('content', 'No content available'),
            'metadata': point.payload.get('metadata', {})
        }
        final_documents.append(document)
    
    return final_documents


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
    

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: generate_references
IMPORT: documents
EXPORT: references
PURPOSE: Extracts and formats the references from 
         the documents to provide to the users.
'''''''''''''''''''''''''''''''''''''''''''''''''''
# def generate_references(documents):
#     unique_urls = set()  #keep track of URLs
#     references_list = []
    
#     for i, doc in enumerate(documents):
#         if isinstance(doc, dict) and 'metadata' in doc:
#             url = doc['metadata'].get('url', '') 
#             if url and url not in unique_urls:  #prevents duplicating URLs
#                 unique_urls.add(url)
#                 references_list.append(f"{len(references_list) + 1}. {url}")
    
#     references = "\n".join(references_list)
#     return references

def generate_references(documents):
    unique_urls = set()  # Keep track of URLs
    references_list = []

    for i, doc in enumerate(documents):
        if isinstance(doc, dict) and 'metadata' in doc:
            url = doc['metadata'].get('url', '')
            if url and url not in unique_urls:  # Prevent duplicating URLs
                unique_urls.add(url)
                references_list.append(url)  # Append just the URL, no need to convert to a formatted string
    
    return references_list if references_list else ["No references available."]


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: normalise_vector
IMPORT: vector
EXPORT: vector / norm
PURPOSE: Normalises all the vector embeddings for
        Qdrant
'''''''''''''''''''''''''''''''''''''''''''''''''''
def normalise_vector(vector):
    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector  #return the original vector if norm is 0
    return vector / norm