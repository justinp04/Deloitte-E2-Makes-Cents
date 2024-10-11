from prompt_engineering import response_complexity, user_income, user_horizon, user_risk, user_loss, user_preference
from user_queries import query_qdrant, get_llm_response

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides stock suggestions to the 
            user based on their profile questions
Date:       04/09/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    recommendations = get_recommendations()
    stock1, stock2, stock3 = parse_recommendations(recommendations) #these are split to help with integration to the front end display
    print(f"{stock1}")
    print(f"{stock2}")
    print(f"{stock3}")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: get_recommendations
IMPORT: none
EXPORT: recommendations
PURPOSE: provides 3 recommended stocks to the user
        based on their user profile
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_recommendations(user):
    system_message = {
    "role": "system",
    "content": (
        "You are a financial assistant."
        f"Provide personalised investment recommendations of 3 ASX stocks based on the following user profile: "
            f"Response Complexity: {user_data['response_complexity']}, "
            f"Income: {user_data['user_income']}, "
            f"Horizon: {user_data['user_horizon']}, "
            f"Risk: {user_data['user_risk']}, "
            f"Loss: {user_data['user_loss']}, "
            f"Preference: {user_data['user_preference']}."
            "Provide just the stock names, no other information."
    )
    },
    {
        "role": "system",
        "content": (
            "Example Response: "
            "Stockname.\n\n"
            "Stockname.\n\n"
            "Stockname.\n\n"
        )
    }

    max_response_tokens = 100 #set the max number of tokens to be used for responses
    response = get_llm_response(system_message, max_response_tokens)
    return response.choices[0].message.content.strip()


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: parse_recommendations
IMPORT: recommendations
EXPORT: stock1, stock2, stock3
PURPOSE: extract individual stock names from LLM
        response
'''''''''''''''''''''''''''''''''''''''''''''''''''
def parse_recommendations(recommendations):
    lines = recommendations.split('\n') #split recommendations into lines
    
    #process each line to remove any leading numbering
    if len(lines) > 0:
        line = lines[0]
        if line.startswith("1. "):
            stock1 = line[3:].strip()
        else:
            stock1 = line.strip()
    if len(lines) > 1:
        line = lines[1]
        if line.startswith("2. "):
            stock2 = line[3:].strip()
        else:
            stock2 = line.strip()
    if len(lines) > 2:
        line = lines[2]
        if line.startswith("3. "):
            stock3 = line[3:].strip()
        else:
            stock3 = line.strip()
    
    return stock1, stock2, stock3


if __name__ == "__main__":
    main()