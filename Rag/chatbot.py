import tiktoken
from user_queries import query_qdrant, get_llm_response
from prompt_engineering import chatbot_experience, chatbot_income, chatbot_invest_length, chatbot_risk, chatbot_loss, chatbot_invest_type
from summary import get_stock_name
import sys

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file handles the functionality for the
            chatbot feature
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    # Check if command-line input is provided
    if len(sys.argv) > 1:
        user_input = sys.argv[1]  # Get the user message from the command-line argument
    else:
        print("No input provided")
        return

    stock_name = extract_stock_name(user_input)
    # Construct the system message
    system_message = {
        "role": "system",
        "content": (
            "You are an ASX stock investment assistant called Gerry. Answer only ASX-related questions. Always give the most up-to-date answer."
            f"Provide personalised answers for someone who is {chatbot_experience()} {chatbot_income()} {chatbot_invest_length()} {chatbot_risk()} {chatbot_loss()} {chatbot_invest_type()}."
            f"You need to provide answers about {stock_name if stock_name else 'the queried stock'}."
            "If you don't have an answer for a stock related question, or you are told to give a specific response, say: 'Oops! Gerry's gears aren't turning on that one.' "
            "For off-topic questions, reply: 'Just keep ya head in the game.' - Troy Bolton 2006."
        )
    }

    max_response_tokens = 200 
    token_limit = 1000  # reduced token limit
    conversation = [system_message]

    # Append the user's input to the conversation
    conversation.append({"role": "user", "content": user_input})

    # Query Qdrant for relevant documents
    documents = query_qdrant(user_input)  # retrieve relevant documents from Qdrant
    context = "\n".join([doc['content'] for doc in documents])

    # Append the context to the conversation
    conversation.append({"role": "system", "content": f"Context:\n{context}"})  # add context to the conversation

    # Check token limits and trim conversation history if needed
    conv_history_tokens = num_tokens_from_messages(conversation)
    while conv_history_tokens + max_response_tokens >= token_limit:
        del conversation[1]  # delete older user messages to keep under token limit
        conv_history_tokens = num_tokens_from_messages(conversation)

    # Get the response from the LLM (language model)
    response = get_llm_response(conversation, max_response_tokens)
    conversation.append({"role": "assistant", "content": response.choices[0].message.content})

    print(response.choices[0].message.content)


'''''''''''''''''''''''''''''''''''''''''''''''''''
Anna added
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


if __name__ == "__main__":
    main()
