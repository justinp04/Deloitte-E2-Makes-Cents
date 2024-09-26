import os
from qdrant_client.models import ScoredPoint, Filter, Match, FieldCondition, MatchText
from load_clients import load_openai_client, load_qdrant_client, load_deployment_name
import numpy as np
from qdrant_client import QdrantClient, models

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


'''def qquery_qdrant(query_text, stock_name):
    query_embedding = get_query_embedding(query_text)
    
    # Perform the search query
    search_result = load_qdrant_client().search(
        collection_name="E2cluster1",
        query_vector=query_embedding, 
        limit=10  # Adjust as needed
    )

    print("Raw search results:", search_result)  # Debug raw search results

    # Remove any extra whitespace from the stock name
    stock_name = stock_name.strip()
    
    # Filter the results based on the stock name
    filtered_results = []
    for point in search_result:  # Directly iterate over the list
        if isinstance(point, ScoredPoint) and hasattr(point, 'payload'):
            payload = point.payload
            metadata = payload.get('metadata', {})
            source = metadata.get('source', '')

            # Check if the source matches the stock name
            if (source.startswith(f"{stock_name}") or
                f"Financial-Statement-{stock_name}.md" in source): 
                filtered_results.append(point)
    
    print("\n\n\nFiltered results:", filtered_results)  # Debug filtered results
    print("\n\n")

    # Format the final documents
    final_documents = []
    for point in search_result:
        document = {
            'content': point.payload.get('content', 'No content available'),
            'metadata': point.payload.get('metadata', {})
        }
        final_documents.append(document)
    
    return final_documents

    keyword_filter = Filter(
    must=[
        FieldCondition(
            key="source",  # Adjust based on your metadata
            match=MatchText(text=f"{stock_name}")  # Keyword-based filtering
        )
    ]
    )
    results = load_qdrant_client().scroll(
        collection_name="E2cluster1",
        limit=10,
        scroll_filter=keyword_filter
    )

    print("hi")
    print(results)

    return results'''


'''def qquery_qdrant(query_text, stock_name):
    try:
        # Preprocess stock name: case-insensitive matching
        stock_name = stock_name.strip().lower()

        # Define acceptable file patterns
        file_patterns = [
            f"{stock_name}-news.txt",
            f"{stock_name}-profile.txt",
            f"{stock_name}_full_quote.txt"
        ]

        # Step 1: Metadata-based filtering to retrieve only relevant points using scroll method
        metadata_filter = Filter(
            must=[
                FieldCondition(
                    key="source",  # Adjust based on your metadata
                    match=MatchText(text=f"{stock_name}")  # Keyword-based filtering
                )
            ]
        )

        # Use scroll to retrieve all points that match the metadata filter
        filtered_points = load_qdrant_client().scroll(
            collection_name="E2cluster1",
            limit=100,  # Fetch up to 100 matching points
            scroll_filter=metadata_filter
        )

        # Extract only the IDs of the filtered points
        filtered_point_ids = [point.id for point in filtered_points]

        # Check if no points were found
        if not filtered_point_ids:
            print("No matching points found for the given stock name and file patterns.")
            return []
            return  # Extra return for readability and flow control

        # Step 2: Generate the query embedding from the user's query text
        query_embedding = get_query_embedding(query_text)

        # Step 3: Perform similarity search only on the filtered vector points
        # We no longer use 'filter', we match by IDs directly
        search_result = load_qdrant_client().search(
            collection_name="E2cluster1",
            query_vector=query_embedding,
            limit=10,  # Adjust as needed
            query_filter={
                "must": [
                    {"key": "id", "match_any": {"values": filtered_point_ids}}
                ]
            }
        )

        # If no search results are found
        if not search_result:
            print("No search results found after applying similarity search on the filtered points.")
            return []
            return  # Extra return for readability and flow control

        # Print the search results for debugging
        print("Filtered and Similarity Search Results:", search_result)

        # Format the final documents to return
        final_documents = []
        for point in search_result:
            document = {
                'content': point.payload.get('content', 'No content available'),
                'metadata': point.payload.get('metadata', {})
            }
            final_documents.append(document)

        return final_documents

    except Exception as e:
        print(f"Error during Qdrant query: {e}")
        return []
        return  # Extra return for readability and flow control '''



def scroll_for_stock(stock_name):
    # Filter to match vectors whose 'source' field starts with the stock name

    print(stock_name)

    source_filter = Filter(
        must=[
            FieldCondition(
                key="source",
                #match=MatchText(text=f"{stock_name}-")  # Stock name-based matching
                match=MatchText(text=stock_name)  # Just search for stock name anywhere in 'source'
            )
        ]
    )

    #print(source_filter)
    
    # Use scroll to retrieve all matching vectors
    scroll_result, next_page = load_qdrant_client().scroll(
        collection_name="E2cluster1",
        scroll_filter=source_filter,
        limit=100  # Adjust based on how many results you expect
    )

    #print("Scroll RESULT: ")
    #print(scroll_result)
    #print("\n\n")

    #for point in scroll_result:
     #   print(point)

    final_documents = []
    
    for point in scroll_result:
        document = {
            'content': point.payload.get('content', 'No content available'),
            'metadata': {
                'source': point.payload.get('source', 'No source available'),
                'url': point.payload.get('url', 'No URL available')
            }
        }
        final_documents.append(document)  # This should be inside the loop
    
    return final_documents
    
    #return scroll_result




def vector_similarity_search(query_embedding, filtered_vectors):
    # Assume query_embedding is already calculated for the user query
    
    # Extract the vector IDs from the filtered results for the similarity search
    vector_ids = [point.id for point in filtered_vectors]
    
    # Perform the vector similarity search on the filtered vectors
    search_result = load_qdrant_client().search(
        collection_name="E2cluster1",
        query_vector=query_embedding,
        limit=10,  # Adjust as needed
        query_filter=models.Filter(
            must=[FieldCondition(
                key="id",  # Ensure you're using the 'id' field of the points
                match=MatchText(text=f"{vector_ids}")  # Match only the filtered vectors
            )]
        )
    )

    print("Search RESULT: ")
    print(search_result)
    print("\n\n")
    
    
    return search_result

def qquery_qdrant(query_text, stock_name):
    try:
        # Preprocess stock name: case-insensitive matching
        stock_name = stock_name.strip()

        # Define acceptable file patterns to match specific document types
        file_patterns = [
            f"{stock_name}-news.txt",
            f"{stock_name}-profile.txt",
            f"{stock_name}_full_quote.txt"
        ]
        print(file_patterns)

        # Step 1: Metadata-based filtering to retrieve only relevant points using scroll method
        # Update the filter to use the file patterns
        metadata_filter = Filter(
            should=[
                FieldCondition(
                    key="source",
                    match=MatchText(text=pattern)
                )
                for pattern in file_patterns
            ]
        )

        # Initialize the client
        client = load_qdrant_client()

        # Use scroll to retrieve all points that match the metadata filter
        scroll_result, next_page = client.scroll(
            collection_name="E2cluster1",
            limit=100,  # Fetch up to 100 matching points
            scroll_filter=metadata_filter  # Now using the updated filter
        )

        # Store all filtered points
        all_filtered_points = scroll_result

        # Continue scrolling until no more points are found
        while next_page is not None:
            scroll_result, next_page = client.scroll(
                collection_name="E2cluster1",
                limit=100,
                offset=next_page,  # Use next_page as the offset
                scroll_filter=metadata_filter
            )
            all_filtered_points.extend(scroll_result)

        # Extract only the IDs of the filtered points
        filtered_point_ids = [point.id for point in all_filtered_points]

        # Check if no points were found
        if not filtered_point_ids:
            print("No matching points found for the given stock name and file patterns.")
            return []

        # Step 2: Generate the query embedding from the user's query text
        query_embedding = get_query_embedding(query_text)

        # Step 3: Perform similarity search only on the filtered vector points
        search_result = client.search(
            collection_name="E2cluster1",
            query_vector=query_embedding,
            limit=10,  # Adjust as needed
            query_filter={
                "must": [
                    {"key": "id", "match_any": {"values": filtered_point_ids}}
                ]
            }
        )

        # If no search results are found
        if not search_result:
            print("No search results found after applying similarity search on the filtered points.")
            return []

        # Print the search results for debugging
        print("Filtered and Similarity Search Results:", search_result)

        # Format the final documents to return
        final_documents = []
        for point in search_result:
            document = {
                'content': point.payload.get('content', 'No content available'),
                'metadata': point.payload.get('metadata', {})
            }
            final_documents.append(document)

        return final_documents

    except Exception as e:
        print(f"Error during Qdrant query: {e}")
        return []



'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: query_qdrant
IMPORT: query_text, embedding_selection
EXPORT: documents
PURPOSE: returns the closest matched results from the
        vector database, based on the generated
        embedding from the users query and then
        extracts the documents from the serch results
'''''''''''''''''''''''''''''''''''''''''''''''''''
'''def query_qdrant(query_text, stock_name):

    print("hi")
    query_embedding = get_query_embedding(query_text)
    
    search_result = load_qdrant_client().search(
        collection_name="E2cluster1",
        query_vector=query_embedding, 
        limit=10  # Adjust as needed
    )

    print(stock_name)

    print("Raw search results:", search_result) #debug
    print("\n\n")

    documents = []
    for point in search_result:
        if isinstance(point, ScoredPoint) and hasattr(point, 'payload') and 'content' in point.payload:
            document = {
                'content': point.payload['content'],
                'metadata': point.payload.get('metadata', {})
            }
            documents.append(document)
        else:
            print(f"Skipping point due to missing payload or content: {point}")
    
    return documents'''


    
'''stock_name = stock_name.strip()

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
    
    print("\n\n\nFiltered results:", filtered_results) #debug
    #filtered_results = search_result
    
    final_documents = []
    for point in filtered_results:
        # print("Processing document:", point.payload) #debug
        
        document = {
            'content': point.payload.get('content', 'No content available'),
            'metadata': point.payload.get('metadata', {})
        }
        final_documents.append(document)
    
    return final_documents'''


'''def query_qdrant(query_text, stock_name):
    query_embedding = get_query_embedding(query_text)
    
    search_result = load_qdrant_client().search(
        collection_name="E2cluster1",
        query_vector=query_embedding, 
        limit=10  #adjust as needed
    )

    print("Raw search results:", search_result)  #debug
    
    stock_name = stock_name.strip()

    filtered_results = search_result  
    
    final_documents = []
    for point in filtered_results:
        if isinstance(point, ScoredPoint) and hasattr(point, 'payload'):
            # print("Processing document:", point.payload)  #debug
            
            document = {
                'content': point.payload.get('content', 'No content available'),
                'metadata': point.payload.get('metadata', {})
            }
            final_documents.append(document)
    
    return final_documents'''

def query_qdrant(query_text, stock_name):
    '''query_embedding = get_query_embedding(query_text)
    
    # Perform the search query
    search_result = load_qdrant_client().search(
        collection_name="E2cluster1",
        query_vector=query_embedding, 
        limit=10  # Adjust as needed
    )

    print("Raw search results:", search_result)  # Debug raw search results

    # Remove any extra whitespace from the stock name
    stock_name = stock_name.strip()
    
    # Filter the results based on the stock name
    filtered_results = []
    for point in search_result:  # Directly iterate over the list
        if isinstance(point, ScoredPoint) and hasattr(point, 'payload'):
            payload = point.payload
            metadata = payload.get('metadata', {})
            source = metadata.get('source', '')

            # Check if the source matches the stock name
            if (source.startswith(f"{stock_name}") or
                f"Financial-Statement-{stock_name}.md" in source): 
                filtered_results.append(point)
    
    print("\n\n\nFiltered results:", filtered_results)  # Debug filtered results

    # Format the final documents
    final_documents = []
    for point in filtered_results:
        document = {
            'content': point.payload.get('content', 'No content available'),
            'metadata': point.payload.get('metadata', {})
        }
        final_documents.append(document)
    
    return final_documents'''

    '''client = load_qdrant_client()

    keyword_filter = Filter(
    must=[
        FieldCondition(
            key="source",  # Adjust based on your metadata
            match=MatchText(text=f"{stock_name}")  # Keyword-based filtering
        )
    ]
    )
    results = client.scroll(
        collection_name="E2cluster1",
        limit=10,
        filter=keyword_filter
    )'''



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
def generate_references(documents):
    unique_urls = set()  #keep track of URLs
    references_list = []
    
    for i, doc in enumerate(documents):
        if isinstance(doc, dict) and 'metadata' in doc:
            url = doc['metadata'].get('url', '') 
            if url and url not in unique_urls:  #prevents duplicating URLs
                unique_urls.add(url)
                references_list.append(f"{len(references_list) + 1}. {url}")
    
    references = "\n".join(references_list)
    return references


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
    
