import tiktoken
from user_queries import query_qdrant, get_llm_response
from prompt_engineering import chatbot_experience, chatbot_income, chatbot_invest_length, chatbot_risk, chatbot_loss, chatbot_invest_type
from summary import get_stock_name
import sys

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file handles the functionality for the
            chatbot feature with question suggestion feature added
Date:       16/09/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    # Check if command-line input is provided
    if len(sys.argv) > 1:
        user_input = sys.argv[1]  # Get the user message from the command-line argument
    else:
        initial_question = generate_initial_question()  # Suggest an initial question
        print(f"Gerry suggests you ask: {initial_question}\n")
        user_input = input("Q:")  # Get input from the user

    stock_name = extract_stock_name(user_input)  # Extract stock name from the user input if available
    
    # Construct the system message
    system_message = {
        "role": "system",
        "content": (
            "You are an ASX stock investment assistant called Gerry. Answer only ASX-related questions. Always give the most up-to-date answer."
            f"Provide personalised answers for someone who is {chatbot_experience()} {chatbot_income()} {chatbot_invest_length()} {chatbot_risk()} {chatbot_loss()} {chatbot_invest_type()}."
            f"You need to provide answers about {stock_name if stock_name else 'the queried stock'}."
            "If you don't have an answer for a stock-related question, or you are told to give a specific response, say: 'Oops! Gerry's gears aren't turning on that one.' "
            "For off-topic questions, reply: 'Just keep ya head in the game.' - Troy Bolton 2006."
        )
    }

    max_response_tokens = 200 
    token_limit = 1000  # Reduced token limit
    conversation = [system_message]

    # Append the user's input to the conversation
    conversation.append({"role": "user", "content": user_input})
    
    # Append stock name context to the user input for document retrieval
    user_input_with_context = f"{user_input}\nProvide answer about {stock_name if stock_name else 'the queried stock'}"

    # Query Qdrant for relevant documents using the user input and stock name context
    documents = query_qdrant(user_input_with_context, stock_name if stock_name else 'the queried stock')
    context = "\n".join([doc['content'] for doc in documents])

    # Append the context to the conversation
    conversation.append({"role": "system", "content": f"Context:\n{context}"})

    # Check token limits and trim conversation history if needed
    conv_history_tokens = num_tokens_from_messages(conversation)
    while conv_history_tokens + max_response_tokens >= token_limit:
        del conversation[1]  # delete older user messages to keep under token limit
        conv_history_tokens = num_tokens_from_messages(conversation)

    # Get the response from the LLM (language model)
    response = get_llm_response(conversation, max_response_tokens)
    assistant_reply = response.choices[0].message.content
    conversation.append({"role": "assistant", "content": assistant_reply})

    print("\n" + assistant_reply + "\n")

    # Generate a follow-up question based on user input and the assistant's reply
    follow_up_question = generate_follow_up_question(user_input, assistant_reply)
    print(f"Gerry suggests you ask: {follow_up_question}\n")



    API_URL = 'http://localhost:4000/news'
USER_RESPONSE_URL = 'http://localhost:4000/next/user-responses'

# Function to fetch user profile from the /next/user-responses endpoint using email
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


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: extract_stock_name
IMPORT: user_input
EXPORT: stock_name (if found in the input)
PURPOSE: Function to extract stock name from user input.
         You can expand this method based on your needs.
'''''''''''''''''''''''''''''''''''''''''''''''''''
def extract_stock_name(user_input):
    # A simple logic to extract stock name from the user input (e.g., regex or keyword-based)
    # For now, assume the stock name is the first word after "about" or "on"
    tokens = user_input.split()
    if "about" in tokens:
        idx = tokens.index("about")
        return tokens[idx + 1] if idx + 1 < len(tokens) else None
    if "on" in tokens:
        idx = tokens.index("on")
        return tokens[idx + 1] if idx + 1 < len(tokens) else None
    return None

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: num_tokens_from_messages
IMPORT: messages, model
EXPORT: num_tokens
PURPOSE: function to calculate the number of tokens
        used by the conversation messages - this is
        to avoid going over the token limit during
        longer conversations 
'''''''''''''''''''''''''''''''''''''''''''''''''''
def num_tokens_from_messages(messages, model="gpt-3.5-turbo-1106"):
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")

    tokens_per_message = 4 #overhead of the message
    num_tokens = 0

    for message in messages:
        num_tokens += tokens_per_message
        for key, value in message.items():
            num_tokens += len(encoding.encode(value))
    num_tokens += 3  #every reply is primed with the assistant
    return num_tokens


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: generate_initial_question
IMPORT: none
EXPORT: question
PURPOSE: generates an initial question to start the
        conversation
'''''''''''''''''''''''''''''''''''''''''''''''''''
def generate_initial_question():
    system_message = [
        {
            "role": "system",
            "content": (
                "You are a financial assistant who provides example questions to someone who doesn't know what questions they should be asking when it comes to investing in stocks."
                " Your only job is to provide a sample question that someone might want to ask about the stock market."
                " Provide only the question without any explanations or preambles."
            )
        }
    ]
    max_response_tokens = 100
    response = get_llm_response(system_message, max_response_tokens)
    return response.choices[0].message.content.strip()


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: generate_follow_up_question
IMPORT: user_input, assistant_reply
EXPORT: question
PURPOSE: generates a follow-up question based on
        the user's query and assistant's response
'''''''''''''''''''''''''''''''''''''''''''''''''''
def generate_follow_up_question(user_input, assistant_reply):
    system_message = [
        {
            "role": "system",
            "content": (
                f"Based on the user's input: {user_input}, and the assistant's reply: {assistant_reply}, suggest a new follow-up question the user might want to ask about stock investment."
                " Keep it relevant to ASX stocks and the context of the conversation."
                " Provide a short, simple follow-up question without explanations or preambles."
            )
        }
    ]
    max_response_tokens = 100
    response = get_llm_response(system_message, max_response_tokens)
    return response.choices[0].message.content.strip()


if __name__ == "__main__":
    main()