'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file holds all the prompt engineering
            functions for summary.py and chatbot.py
Date:       18/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

#this is where the user registration questions should be loaded in from the sql database (where the example numbers currently are)
user_profile = {
        "experience_level": "5",
        "annual_income": "4",
        "investment_horizon": "2",
        "risk_tolerance": "4",
        "short_term_loss_tolerance": "2",
        "investment_preference": "3"
    }

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: response_complexity
IMPORT: user_profile
EXPORT: complexity_instruction
PURPOSE: provides instructions on response complexity
'''''''''''''''''''''''''''''''''''''''''''''''''''
def response_complexity():
    levels = {
        "1": "Use basic language for beginners.",
        "2": "Provide simple, clear information.",
        "3": "Offer a balanced explanation with some detail.",
        "4": "Include detailed analysis and technical terms.",
        "5": "Deliver expert insights with advanced terminology."
    }
    return levels.get(user_profile['experience_level'], "")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: user_income
IMPORT: NONE
EXPORT: income_instruction
PURPOSE: instructs the LLM based on user income
'''''''''''''''''''''''''''''''''''''''''''''''''''
def user_income():
    incomes = {
        "1": "with low costs to minimize risk and fees,",
        "2": "of stable ASX blue-chips or dividend payers,",
        "3": "suitable for a diversified ASX portfolio including mid-caps,",
        "4": "in growth sectors with higher potential returns,",
        "5": "with high yield and speculative opportunities,"
    }
    return incomes.get(user_profile['annual_income'], "")

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: user_horizon
IMPORT: NONE
EXPORT: horizon_instruction
PURPOSE: instructs the LLM based on user investment horizon
'''''''''''''''''''''''''''''''''''''''''''''''''''
def user_horizon():
    horizons = {
        "1": " suitable for short-term goals with high liquidity,",
        "2": " balancing growth and income for medium-term goals,",
        "3": " with high growth potential for long-term investments,"
    }
    return horizons.get(user_profile['investment_horizon'], "")

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: user_risk
IMPORT: NONE
EXPORT: risk_instruction
PURPOSE: instructs the LLM based on user risk tolerance
'''''''''''''''''''''''''''''''''''''''''''''''''''
def user_risk():
    risks = {
        "1": " with low risk, such as government bonds or defensive stocks,",
        "2": " with steady returns, like blue-chip or dividend stocks,",
        "3": " with a balanced risk profile, including growth stocks,",
        "4": " with higher volatility and growth potential,",
        "5": " with high risk and speculative characteristics,"
    }
    return risks.get(user_profile['risk_tolerance'], "")

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: user_loss
IMPORT: NONE
EXPORT: loss_instruction
PURPOSE: instructs the LLM based on user short-term loss tolerance
'''''''''''''''''''''''''''''''''''''''''''''''''''
def user_loss():
    losses = {
        "1": " with low volatility to avoid short-term losses,",
        "2": " with minimal risk and stability,",
        "3": " with a balance of defensive and growth attributes,",
        "4": " with higher volatility for greater potential returns,",
        "5": " with high risk and substantial potential for short-term losses,"
    }
    return losses.get(user_profile['short_term_loss_tolerance'], "")

'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: user_preference
IMPORT: NONE
EXPORT: preference_instruction
PURPOSE: instructs the LLM based on user investment preference
'''''''''''''''''''''''''''''''''''''''''''''''''''
def user_preference():
    preferences = {
        "1": " and that is undervalued and suitable for a lump sum.",
        "2": " and that fits both lump sum and recurring investments.",
        "3": " and with stable performance for regular investments."
    }
    return preferences.get(user_profile['investment_preference'], "")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: chatbot_experience
IMPORT: NONE
EXPORT: experience
PURPOSE: instructs the LLM based on user investment preference
        for the chatbot feature
'''''''''''''''''''''''''''''''''''''''''''''''''''
def chatbot_experience(user_profile=None):
    experience = {
        "1": " novice at stock investing,",
        "2": " beginner at stock investing,",
        "3": " intermediate at stock investing,",
        "4": " advanced at stock investing,",
        "5": " expert at stock investing,"
    }
    return experience.get(user_profile['question_response_1'], "")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: chatbot_income
IMPORT: NONE
EXPORT: income
PURPOSE: instructs the LLM based on user income
        for the chatbot feature
'''''''''''''''''''''''''''''''''''''''''''''''''''
def chatbot_income(user_profile=None):
    income = {
        "1": " earns less than AUD$18,000,",
        "2": " earns AUD$18,000-$45,000,",
        "3": " earns AUD$45,000-$135,000,",
        "4": " earns AUD$135,000-$190,000,",
        "5": " earns more than AUD$190,000,"
    }
    return income.get(user_profile['question_response_2'], "")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: chatbot_invest_length
IMPORT: NONE
EXPORT: invest_length
PURPOSE: instructs the LLM based on user investment
        length for the chatbot feature
'''''''''''''''''''''''''''''''''''''''''''''''''''
def chatbot_invest_length(user_profile=None):
    invest_length = {
        "1": " wants to hold investments for less than 3 years,",
        "2": " wants to hold investments for 3-10 years",
        "3": " wants to hold investments for more than 10 years,"
    }
    return invest_length.get(user_profile['question_response_3'], "")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: chatbot_risk
IMPORT: NONE
EXPORT: risk
PURPOSE: instructs the LLM based on user risk willingness
        for the chatbot feature
'''''''''''''''''''''''''''''''''''''''''''''''''''
def chatbot_risk(user_profile=None):
    risk = {
        "1": " has very low risk tolerance,",
        "2": " has low risk tolerance,",
        "3": " has moderate risk tolerance,",
        "4": " has high risk tolerance,",
        "5": " has very high risk tolerance,"
    }
    return risk.get(user_profile['question_response_4'], "")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: chatbot_loss
IMPORT: NONE
EXPORT: loss
PURPOSE: instructs the LLM based on user short-term loss
        for the chatbot feature
'''''''''''''''''''''''''''''''''''''''''''''''''''
def chatbot_loss(user_profile=None):
    loss = {
        "1": " can handle no short term decline,",
        "2": " can handle minimal short term decline,",
        "3": " can handle moderate short term decline,",
        "4": " can handle significant short term decline,",
        "5": " can handle substantial short term decline,"
    }
    return loss.get(user_profile['question_response_5'], "")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: chatbot_invest_type
IMPORT: NONE
EXPORT: invest_type
PURPOSE: instructs the LLM based on user investment type
        for the chatbot feature
'''''''''''''''''''''''''''''''''''''''''''''''''''
def chatbot_invest_type(user_profile):
    invest_type = {
        "1": " and prefers investing lump sums.",
        "2": " and prefers lump sum and recurring investments.",
        "3": " and prefers investing recurring sums."
    }
    return invest_type.get(user_profile['question_response_1'], "")
