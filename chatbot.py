import tiktoken
from user_queries import query_qdrant, get_llm_response
from prompt_engineering import chatbot_experience, chatbot_income, chatbot_invest_length, chatbot_risk, chatbot_loss, chatbot_invest_type
from summary import get_stock_name

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file handles the functionality for the
            chatbot feature
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    system_message = {
    "role": "system",
    "content": (
        "You are an ASX stock investment assistant called Gerry. Answer only ASX-related questions. Always give the most up-to-date answer."
        f"Provide personalised answers for someone who is {chatbot_experience()} {chatbot_income()} {chatbot_invest_length()} {chatbot_risk()} {chatbot_loss()} {chatbot_invest_type()}"
        f"You need to provide answers about {get_stock_name()}."
        "If you don't have an answer for a stock related question, or you are told to give a specific response, say: 'Oops! Gerry's gears aren't turning on that one.' "
        "For off-topic questions, reply: ' 'Just keep ya head in the game.' Troy Bolton 2006'"
    )
    }

    max_response_tokens = 200 
    token_limit = 1000 #this was originally 4096 but ive reduced it to try and help with token limits
    conversation = []
    conversation.append(system_message)

    while True:
        user_input = input("Q: ")
        user_input_with_context = f"{user_input}\nProvide answer about {get_stock_name()}"
        conversation.append({"role": "user", "content": user_input})
        stock_name = get_stock_name()
        documents = query_qdrant(user_input_with_context, stock_name) #retrieve relevant documents from qdrant
        context = "\n".join([doc['content'] for doc in documents])

        conversation.append({"role": "system", "content": f"Context:\n{context}"}) #add context to the conversation
        conv_history_tokens = num_tokens_from_messages(conversation)
        
        while conv_history_tokens + max_response_tokens >= token_limit: #check if the token limit will be exceeded
            del conversation[1]
            conv_history_tokens = num_tokens_from_messages(conversation)

        response = get_llm_response(conversation, max_response_tokens)
        conversation.append({"role": "assistant", "content": response.choices[0].message.content})
        print("\n" + response.choices[0].message.content + "\n")


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
