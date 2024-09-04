from prompt_engineering import response_complexity, user_income, user_horizon, user_risk, user_loss, user_preference
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
    #stock_name = input("") #THIS NEEDS TO BE TAKEN FROM THE USER INPUT ON THE FRONT END SEARCH BAR!
    stock_name = get_stock_name()
    user_query = f"Would {stock_name} be a good investment choice for me to make?"
    documents = query_qdrant(user_query)
    #print(documents) #can comment this in for debugging purposes
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
    stock_name = input("Input: ") #THIS NEEDS TO BE TAKEN FROM THE USER INPUT ON THE FRONT END SEARCH BAR!
    #stock_name = "Woolworths" #THIS IS JUST A TEST FOR CHATBOT, DELETE THIS LINE WHEN HOOKED UP TO FRONT END
    return stock_name


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: generate_response
IMPORT: documents, user_query
EXPORT: response
PURPOSE: generates the customised sentiment summary
        response to be provided to the user
'''''''''''''''''''''''''''''''''''''''''''''''''''
def generate_response(documents, user_query):
    #context = "\n".join(documents)
    context = "\n".join([doc['content'] for doc in documents])

    messages = [
    {
        "role": "system",
        "content": (
            f"You are a financial assistant providing personalised advice. A good stock would be one {user_income()} {user_horizon()} {user_risk()} {user_loss()} {user_preference()} {response_complexity()}."
        )
    },
    {
        "role": "system",
        "content": (
            "Example Response: Based on your criteria, Woolworths may not be ideal.\n\n"
            "1. reason1.\n\n"
            "2. reason2.\n\n"
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
                    "You are an assistant that helps summarize information. Take the provided text and provide a brief and to-the-point summary in 100 words or less. Make sure to include a clear yes or no conclusion in the summary."
                )
            },
            {
                "role": "user",
                "content": f"Context:\n{answer}"
            }
        ]
        quick_answer = get_llm_response(system_message, max_response_tokens=100)
        print(f"{quick_answer.choices[0].message.content.strip()}")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: generate_references
IMPORT: documents
EXPORT: references
PURPOSE: extracts and formats the references 
        from the documents to provide to the users
'''''''''''''''''''''''''''''''''''''''''''''''''''
def generate_references(documents):
    references_list = []
    for i, doc in enumerate(documents):
        if isinstance(doc, dict) and 'metadata' in doc and 'source' in doc['metadata']:
            references_list.append(f"{i+1}. {doc['metadata']['source']}")
        else:
            references_list.append(f"{i+1}. Source not available")

    references = "\n".join(references_list)
    return references


if __name__ == "__main__":
    main()

