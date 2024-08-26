import tiktoken
from user_queries import query_qdrant, get_llm_response
import sys

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file handles the functionality for the
            chatbot feature
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    try:
        if len(sys.argv) > 1:
            user_input = sys.argv[1]  # Capture the command-line input
        else:
            user_input = "default query"  # Fallback input

        # Your existing script logic
        system_message = {"role": "system", "content": "You are a helpful assistant that helps a user make informed stock investment decisions."}
        max_response_tokens = 300
        token_limit = 4096
        conversation = [system_message]

        # Append only the last few messages to maintain context
        if len(conversation) > 6:  # Limit to the last 3 pairs of user-bot exchanges
            conversation = conversation[-6:]

        conversation.append({"role": "user", "content": user_input})
        documents = query_qdrant(user_input)
        context = "\n".join(documents)
        
        conversation.append({"role": "system", "content": f"Context:\n{context}"})
        conv_history_tokens = num_tokens_from_messages(conversation)

        while conv_history_tokens + max_response_tokens >= token_limit:
            del conversation[1]
            conv_history_tokens = num_tokens_from_messages(conversation)

        response = get_llm_response(conversation, max_response_tokens)
        conversation.append({"role": "assistant", "content": response.choices[0].message.content})
        print(response.choices[0].message.content)  # Immediate response output

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)


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
