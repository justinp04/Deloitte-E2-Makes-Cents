from prompt_engineering import response_complexity, user_income, user_horizon, user_risk, user_loss, user_preference
from user_queries import get_llm_response, generate_references, search_for_stock_summary
import sys
import json, re
from load_clients import load_blob_client
from stock_search import get_stock_ticker
import requests

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides the stock summary feature.
            it takes in a stock name and provides a customised
            sentiment analysis to the user.
Date:       18/08/24
Collab: Anna Duong
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Add user response URL endpoint to fetch user profile
USER_RESPONSE_URL = 'http://localhost:4000/next/user-responses'

def fetch_user_profile(user_email):
    try:
        response = requests.get(USER_RESPONSE_URL, params={"email": user_email})
        response.raise_for_status()
        user_data = response.json()  # Parse the JSON response
        
        user_response_str = user_data.get('response', '')
        if len(user_response_str) != 6:
            print("Unexpected response format.")
            return None

        user_profile = {
            'question_response_1': user_response_str[0],
            'question_response_2': user_response_str[1],
            'question_response_3': user_response_str[2],
            'question_response_4': user_response_str[3],
            'question_response_5': user_response_str[4],
            'question_response_6': user_response_str[5]
        }
        return user_profile
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user profile: {e}")
        return None

import argparse

def main():
    # Set up command-line argument parsing
    parser = argparse.ArgumentParser(description="Stock Summary Script")
    parser.add_argument('--stock_name', required=True, help="Name of the stock to analyze.")
    parser.add_argument('--user_email', required=True, help="Email of the user for fetching profile.")
    parser.add_argument('--response_depth', required=True, choices=['quick', 'detailed'], help="Depth of the response: 'quick' or 'detailed'.")

    args = parser.parse_args()

    # Assign the arguments to variables
    stock_name = args.stock_name
    user_email = args.user_email
    response_depth = args.response_depth

    # Print to confirm arguments received correctly (for debugging purposes)
    print(f"Received stock name: {stock_name}")
    print(f"Received user email: {user_email}")
    print(f"Received response depth: {response_depth}")

    # Load blob client and check if stock can be analyzed
    container_client = load_blob_client()
    blob_names = [blob.name for blob in container_client.list_blobs()]

    if not any(stock_name in blob_name for blob_name in blob_names):
        print(f"The stock '{stock_name}' cannot be analysed at this time!")
        return

    # Fetch the user profile using the provided email
    user_profile = fetch_user_profile(user_email)
    if not user_profile:
        sys.exit(1)

    user_query = f"Would {stock_name} be a good investment choice for me to make?"
    documents = search_for_stock_summary(stock_name, user_query)

    # Generate both quick and detailed summaries based on user query
    detailed_answer = generate_response(documents, user_query, user_profile)
    quick_answer = response_length(detailed_answer, response_depth=response_depth)

    references = generate_references(documents)

    # Return both summaries and references
    result = {
        "quick_summary": quick_answer,
        "detailed_summary": detailed_answer.replace('. ', '.\n\n'),
        "references": references
    }

    print(json.dumps(result, indent=4))  # Output the result as JSON

if __name__ == "__main__":
    main()


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
IMPORT: documents, user_query, user_profile
EXPORT: response
PURPOSE: generates the customised sentiment summary
        response to be provided to the user
'''''''''''''''''''''''''''''''''''''''''''''''''''
def generate_response(documents, user_query, user_profile):
    context = "\n".join([doc['content'] for doc in documents])

    messages = [
    {
        "role": "system",
        "content": (
            f"You are a financial assistant providing personalized advice. A good stock would be one "
            f"{user_income(user_profile)} {user_horizon(user_profile)} {user_risk(user_profile)} "
            f"{user_loss(user_profile)} {user_preference(user_profile)} {response_complexity()}."
        )
    },
    {
        "role": "system",
        "content": (
            "Template to follow for response: Based on your criteria, this stock may/may not be ideal."
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

    max_response_tokens = 450  # set the max number of tokens to be used for responses
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
    Ensures that numbered lists are formatted correctly in the response.
    This function removes unnecessary newlines and formats numbers and content properly.
    """

    # Replace "\n\n[number]\n\n" with "\n[number]\t" to remove extra line breaks after the number
    formatted_summary = re.sub(r'\n{2}(\d+)\.\n{2}', r'\n\1.\t', detailed_answer)

    # Ensure sentences are followed by two newlines for better paragraph spacing
    formatted_summary = re.sub(r'([a-zA-Z0-9])\. ', r'\1.\n\n', formatted_summary)

    # Remove any extra lingering newlines after periods if too many (e.g., more than 2)
    formatted_summary = re.sub(r'\n{3,}', '\n\n', formatted_summary)

    # Optionally, handle "\n[number]\n\n" cases where there might be only one newline before the number
    formatted_summary = re.sub(r'\n(\d+)\.\n{2}', r'\n\1.\t', formatted_summary)

    return formatted_summary


if __name__ == "__main__":
    main()

