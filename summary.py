from prompt_engineering import user_customisation, response_complexity, response_length
from user_queries import query_qdrant, get_llm_response

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides the stock summary feature.
            it takes in a stock name and provides a customised
            sentiment analysis to the user.
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    stock_name = input("Enter the stock name: ")
    user_query = f"Would {stock_name} be a good investment choice for me to make based on my user profile?"
    documents = query_qdrant(user_query)
    print(documents)
    answer = generate_response(documents, user_query)
    print(f"{answer}")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: generate_response
IMPORT: documents, user_query
EXPORT: response
PURPOSE: generates the customised sentiment summary
        response to be provided to the user
'''''''''''''''''''''''''''''''''''''''''''''''''''
def generate_response(documents, user_query):
    context = "\n".join(documents)

    messages = [
        {"role": "system", "content": f"You are a financial assistant that provides personalized investment advice. {response_complexity()} {response_length()}"},
        {"role": "user", "content": f"User Profile:\n{user_customisation()}\n\nContext:\n{context}\n\nUser Query:\n{user_query}"}
    ]
    
    max_response_tokens = 450 #set the max number of tokens to be used for responses
    response = get_llm_response(messages, max_response_tokens)
    return response.choices[0].message.content.strip()


if __name__ == "__main__":
    main()
