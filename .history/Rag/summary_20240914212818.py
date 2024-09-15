from prompt_engineering import response_complexity, user_income, user_horizon, user_risk, user_loss, user_preference
from user_queries import query_qdrant, get_llm_response, generate_references
import sys
import json, re

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides the stock summary feature.
            it takes in a stock name and provides a customised
            sentiment analysis to the user.
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    stock_name = sys.argv[1]
    # response_depth = sys.argv[2]

    user_query = f"Would {stock_name} be a good investment choice for me to make?"
    
    documents = query_qdrant(user_query, stock_name);
    #print(documents) #can comment this in for debugging purposes

    # Generate both quick and detailed summaries
    detailed_answer = generate_response(documents, user_query)
    
    # Generate quick summary using response_length function
    quick_answer = response_length(detailed_answer, response_depth="quick")

    references = generate_references(documents)

    # Return both summaries and references
    result = {
        "quick_summary": quick_answer,
        "detailed_summary": detailed_answer.replace('. ', '.\n\n'),
        "references": references
    }
    
    print(json.dumps(result, indent=4))  # Output the result as JSON

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: stock_name
IMPORT: none
EXPORT: stock_name
PURPOSE: gets the stock name from the user input
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_stock_name():
    stock_name = input("Input: ") #THIS NEEDS TO BE TAKEN FROM THE USER INPUT ON THE FRONT END SEARCH BAR!
    # stock_name = "Woolworths" #THIS IS JUST A TEST FOR CHATBOT, DELETE THIS LINE WHEN HOOKED UP TO FRONT END
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
        )
    },
    {
        "role": "system",
        "content": (
            "Template to follow for response: Based on your criteria, Woolworths may/may not be ideal."
            "1. reason1.\n"
            "2. reason2.\n"
            "3. reason3.\n"
            "4. reason4.\n"
            "5. reason5.\n"
            "6. reason6.\n"
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
    
    # Clean up the detailed response to ensure proper formatting
    detailed_answer = response.choices[0].message.content.strip()
    formatted_response = format_detailed_summary(detailed_answer)
    return formatted_response


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
        
        # Check if the response is valid
        if quick_answer and quick_answer.choices:
            return quick_answer.choices[0].message.content.strip()
        else:
            return "Failed to generate a quick summary."

def clean_summary_text(text):
    # Replace multiple newlines with a single newline and ensure proper spacing
    text = re.sub(r'\n\s*\n', '\n', text)  # Replace multiple newlines with a single newline
    return text


def format_detailed_summary(detailed_answer):
    """
    Formats the detailed summary to:
    - Ensure numbered lists are formatted correctly.
    - Bold text between the number and colon (e.g., 'Growth Potential').
    """

    # Replace "\n\n[number]\n\n" with "\n[number]\t" to remove extra line breaks after the number
    formatted_summary = re.sub(r'\n{2}(\d+)\.\n{2}', r'\n\1.\t', detailed_answer)

    # Ensure sentences are followed by two newlines for better paragraph spacing
    formatted_summary = re.sub(r'([a-zA-Z0-9])\. ', r'\1.\n\n', formatted_summary)

    # Bold the text after the number (e.g., '1. Growth Potential:')
    formatted_summary = re.sub(r'(\d+\.\s+)([A-Za-z\s]+)(:)', r'\1**\2**\3', formatted_summary)

    # Remove any extra lingering newlines after periods if too many (e.g., more than 2)
    formatted_summary = re.sub(r'\n{3,}', '\n\n', formatted_summary)

    return formatted_summary


if __name__ == "__main__":
    main()

