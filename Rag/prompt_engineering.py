from user_profile import load_user_profile

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file holds all the prompt engineering
            functions for summary.py and chatbot.py
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: load_user_profile
IMPORT: none
EXPORT: user_profile
PURPOSE: This function loads the user profile based
        on their responses to the registration
        questions saved in the mySQL database
'''''''''''''''''''''''''''''''''''''''''''''''''''
'''def load_user_profile():
    user_profile = {
        "experience_level": "novice",
        "annual_income": "135,000 - 190,000",
        "investment_horizon": "less than 3 years",
        "risk_tolerance": "low",
        "short_term_loss_tolerance": "minimal",
        "investment_preference": "recurring"
    }
    return user_profile'''

user_profile = {
        "experience_level": "novice",
        "annual_income": "135,000 - 190,000",
        "investment_horizon": "less than 3 years",
        "risk_tolerance": "low",
        "short_term_loss_tolerance": "minimal",
        "investment_preference": "recurring"
    }

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: user_customisation
IMPORT: user_profile
EXPORT: user_profile_context
PURPOSE: creates the user profile based on responses
        to the registration questions
'''''''''''''''''''''''''''''''''''''''''''''''''''
def user_customisation():
    user_profile_context = (
        f"Experience Level: {user_profile['experience_level']}\n"
        f"Annual Income: {user_profile['annual_income']}\n"
        f"Investment Horizon: {user_profile['investment_horizon']}\n"
        f"Risk Tolerance: {user_profile['risk_tolerance']}\n"
        f"Short-Term Loss Tolerance: {user_profile['short_term_loss_tolerance']}\n"
        f"Investment Preference: {user_profile['investment_preference']}\n"
    )
    return user_profile_context


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: response_complexity
IMPORT: user_profile
EXPORT: complexity_instruction
PURPOSE: takes the information from the user profile
        to provide the LLM with an instruction on how
        financially complex responses should be. this
        is based on the experience level of the user
        provided in the registration questions
'''''''''''''''''''''''''''''''''''''''''''''''''''
def response_complexity():
    experience_level = user_profile['experience_level']
    if experience_level in ["novice"]:
        complexity_instruction = "Provide a simple and easy-to-understand response, for someone with no stock investment knowledge or investing background."
    elif experience_level in ["beginner"]:
        complexity_instruction = "Provide a simple and easy-to-understand response."
    elif experience_level in ["intermediate"]:
        complexity_instruction = "Provide a balanced response that is clear but includes some detail."
    elif experience_level in ["advanced"]:
        complexity_instruction = "Provide a detailed and in-depth response."
    elif experience_level in ["expert"]:
        complexity_instruction = "Provide a detailed and in-depth response. The use of technical jargon is encouraged."
    return complexity_instruction


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: response_length
IMPORT: response_depth
EXPORT: length_instruction
PURPOSE: gives instructions to the LLM to either make
        its response 'quick' or 'detailed'. this is
        for the feature that lets the user toggle
        the detailed view for the summary response
'''''''''''''''''''''''''''''''''''''''''''''''''''
def response_length(response_depth = "detailed"):
    if response_depth == "quick":
        length_instruction = " Keep the response concise and to the point. The reader should be able to grasp the main concepts presented to them quickly and easily."
    elif response_depth == "detailed":
        length_instruction = " Expand on relevant details and provide a thorough explanation. Explain each conclusion you come to."
    return length_instruction



#def user_income():
    #if annual_income