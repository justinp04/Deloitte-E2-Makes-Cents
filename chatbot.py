import tiktoken
from user_queries import query_qdrant, get_llm_response
from prompt_engineering import chatbot_experience, chatbot_income, chatbot_invest_length, chatbot_risk, chatbot_loss, chatbot_invest_type
from summary import get_stock_name

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file handles the functionality for the
            chatbot feature with question suggestion
            feature added
Date:       16/09/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    system_message = {
    "role": "system",
    "content": (
        "You are an ASX stock investment assistant called Gerry. Answer only ASX-related questions. Always give the most up-to-date answer. Match your answer exactly to the context you are provided."
        f"Provide personalised answers for someone who is {chatbot_experience()} {chatbot_income()} {chatbot_invest_length()} {chatbot_risk()} {chatbot_loss()} {chatbot_invest_type()}"
        f"You need to provide answers about {get_stock_name()}."
        "If you don't have an answer for a stock-related question, or you are told to give a specific response, say: 'Oops! Gerry's gears aren't turning on that one.' "
        "For off-topic questions, reply: ' 'Just keep ya head in the game.' Troy Bolton 2006'"
    )
    }

    max_response_tokens = 200 
    token_limit = 1000
    conversation = []
    conversation.append(system_message)

    initial_question = generate_initial_question() #generate inital suggestion question - would be cute if this popped up as a little Gerry cloud thinking moment
    print(f"Gerry suggests you ask: {initial_question}\n")

    while True:
        user_input = input("Q:")
        conversation.append({"role": "user", "content": user_input})
        stock_name = get_stock_name()

        documents = query_qdrant(user_input, stock_name) #retreive relevant docs
        context = "\n".join([doc['content'] for doc in documents])

        conversation.append({"role": "system", "content": f"Context:\n{context}"})
        conv_history_tokens = num_tokens_from_messages(conversation)

        while conv_history_tokens + max_response_tokens >= token_limit: #check token capacity
            del conversation[1]
            conv_history_tokens = num_tokens_from_messages(conversation)

        response = get_llm_response(conversation, max_response_tokens)
        assistant_reply = response.choices[0].message.content
        conversation.append({"role": "assistant", "content": assistant_reply})
        print("\n" + assistant_reply + "\n")

        follow_up_question = generate_follow_up_question(user_input, assistant_reply) #generate a follow-up question based on user input and gerry response
        print(f"Gerry suggests you ask: {follow_up_question}\n")



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

    tokens_per_message = 4
    num_tokens = 0

    for message in messages:
        num_tokens += tokens_per_message
        for key, value in message.items():
            num_tokens += len(encoding.encode(value))
    num_tokens += 3
    return num_tokens


if __name__ == "__main__":
    main()