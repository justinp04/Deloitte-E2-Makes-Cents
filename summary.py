from prompt_engineering import response_complexity, user_income, user_horizon, user_risk, user_loss, user_preference
from user_queries import query_qdrant, get_llm_response, generate_references
from load_clients import load_blob_client

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides the stock summary feature.
            it takes in a stock name and provides a customised
            sentiment analysis to the user.
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    container_client = load_blob_client()
    blob_names = [blob.name for blob in container_client.list_blobs()]
    
    #stock_name = input("") #THIS NEEDS TO BE TAKEN FROM THE USER INPUT ON THE FRONT END SEARCH BAR!
    stock_name = get_stock_name()

    if not any(stock_name in blob_name for blob_name in blob_names):
        print(f"The stock '{stock_name}' cannot be analysed at this time!")
        return

    user_query = f"Would {stock_name} be a good investment choice for me to make?"

    documents = query_qdrant(user_query, stock_name)
    answer = generate_response(documents, user_query)
    references = generate_references(documents)
    
    response_length(answer, response_depth="detailed") #RESPONSE DEPTH TAKEN FROM TOGGLE MENU ON FRONT END!
    print(f"References:\n{references}")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: stock_name
IMPORT: none
EXPORT: stock_name
PURPOSE: gets the stock name from the user input
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_stock_name():
    #stock_name = input("Input: ") #THIS NEEDS TO BE TAKEN FROM THE USER INPUT ON THE FRONT END SEARCH BAR!
    stock_name = "ADH" #THIS IS JUST A TEST FOR CHATBOT, DELETE THIS LINE WHEN HOOKED UP TO FRONT END
    return stock_name


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: generate_response
IMPORT: documents, user_query
EXPORT: response
PURPOSE: generates the customised sentiment summary
        response to be provided to the user
'''''''''''''''''''''''''''''''''''''''''''''''''''
def generate_response(documents, user_query):
    context = "\n".join([doc['content'] for doc in documents])
    #print(context)

    messages = [
    {
        "role": "system",
        "content": (
            f"You are a financial assistant providing personalised advice. A good stock would be one {user_income()} {user_horizon()} {user_risk()} {user_loss()} {user_preference()} {response_complexity()}."
            " The response needs to be around 170 words in length."
            " Don't include disclaimers or advice that doesn't add value to the core response."
        )
    },
    {
        "role": "system",
        "content": (
            "Template to follow for response: Based on your criteria, Woolworths may/may not be ideal.\n\n"
            "1. reason1.\n\n"
            "2. reason2.\n\n"
            "3. reason3.\n\n"
            "4. reason4.\n\n"
            "5. reason5.\n\n"
            "6. reason6.\n\n"
            "Stick to this template strictly"
        )
    },
    {
        "role": "user",
        "content": f"Context:\n{context}\n\nUser Query:\n{user_query}"
    }
    ]

    max_response_tokens = 450 #set the max number of tokens to be used for responses
    response = get_llm_response(messages, max_response_tokens)
    return response.choices[0].message.content.strip()


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: response_length
IMPORT: answer, response_depth
EXPORT: none
PURPOSE: can either provide a detailed summary to the
        user, or a quick summary depending on the 
        option selected by the user 
'''''''''''''''''''''''''''''''''''''''''''''''''''
def response_length(answer, response_depth):
    if response_depth == "detailed":
        print(f"{answer}")
    elif response_depth == "quick":
        system_message = [
            {
                "role": "system",
                "content": (
                    "You are an assistant that helps summarize information. Take the provided text and provide a brief and to-the-point summary in approximately 50 words."
                    " Include a clear yes or no conclusion at the start of the summary."
                    " Don't include disclaimers or advice that doesn't add value to the core response."
                )
            },
            {
                "role": "user",
                "content": f"Context:\n{answer}"
            }
        ]
        quick_answer = get_llm_response(system_message, max_response_tokens=100)
        print(f"{quick_answer.choices[0].message.content.strip()}")



if __name__ == "__main__":
    main()

