'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Anna Duong, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides the news feed feature to
            provide personalised summaries of relevant 
            news to users - implemented based on news_feed.py
Date:       05/09/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

import argparse
import sys
import requests
from user_queries import get_llm_response
from prompt_engineering import chatbot_experience, chatbot_income, chatbot_invest_length, chatbot_risk, chatbot_loss, chatbot_invest_type


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


def generate_summary(article_title, article_url, user_profile):
    instruction = (
        "You are a financial assistant providing personalized summaries about current news events. "
        "You need to provide a short summary of the main points of the article, and about how the news article would affect the investment choices "
        f"of someone who is a {chatbot_experience(user_profile)} {chatbot_income(user_profile)} {chatbot_invest_length(user_profile)} "
        f"{chatbot_risk(user_profile)} {chatbot_loss(user_profile)} {chatbot_invest_type(user_profile)}. "
        "If the news would have a positive effect on the person, say: 'This has a positive impact'. "
        "If the news would have a negative effect, say: 'This has a negative impact'."
    )

    content = f"Title: {article_title}\nURL: {article_url}"

    messages = [
        {"role": "system", "content": instruction},
        {"role": "user", "content": content}
    ]

    try:
        response = get_llm_response(messages, max_response_tokens=300)
        summary = response.choices[0].message.content.strip()
        return summary
    except Exception as e:
        return "Summary not available."


def main():
    # Set up command-line argument parsing
    parser = argparse.ArgumentParser(description="Generate article summaries for a stock.")
    parser.add_argument('--user_email', required=True, help="User email to fetch profile.")
    parser.add_argument('--stock', required=True, help="Stock symbol.")
    parser.add_argument('--article_title', required=True, help="Title of the news article.")
    parser.add_argument('--article_url', required=True, help="URL of the news article.")
    
    args = parser.parse_args()

    # Step 1: Fetch the user responses
    user_profile = fetch_user_profile(args.user_email)
    if not user_profile:
        sys.exit(1)

    # Step 2: Generate personalized summary for the article
    summary = generate_summary(args.article_title, args.article_url, user_profile)

    # Step 3: Output the summary
    print(summary)


if __name__ == "__main__":
    main()