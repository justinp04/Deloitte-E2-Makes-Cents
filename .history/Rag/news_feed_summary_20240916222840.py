'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Anna Duong, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides the news feed feature to
            provide personalised summaries of relevant 
            news to users - implemented based on news_feed.py
Date:       05/09/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

import mysql.connector
import requests
from openai import OpenAI
from prompt_engineering import chatbot_experience, chatbot_income, chatbot_invest_length, chatbot_risk, chatbot_loss, chatbot_invest_type
from user_queries import get_llm_response


API_URL = 'http://localhost:4000/news'
USER_RESPONSE_URL = 'http://localhost:4000/next/user-responses'


# Function to fetch user profile from the /next/user-responses endpoint using email
def fetch_user_profile(user_email):
    try:
        response = requests.get(USER_RESPONSE_URL, params={"email": user_email})
        response.raise_for_status()  # Raise error if the request fails
        user_data = response.json()  # Parse the JSON response
        
        # Process the "response" string and map it to the correct profile attributes
        user_response_str = user_data.get('response', '')
        if len(user_response_str) != 6:
            print("Unexpected response format.")
            return None

        # Map each digit to the respective question response
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


def fetch_news_from_api(stock):
    try:
        response = requests.get(API_URL, params={"symbol": stock})
        response.raise_for_status()
        news_data = response.json()
        
        if 'data' in news_data and 'news' in news_data['data']:
            return news_data['data']['news'][:5]  # Fetch the 5 most recent articles
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching news for {stock}: {e}")
    return []


def generate_llm_summary(articles, user_profile):
    # Generate the personalized instruction using the profile
    instruction = (
        "You are a financial assistant providing personalized summaries about current news events. "
        "You need to provide a short summary of the main points of the article, and about how the news article would affect the investment choices "
        f"of someone who is a {chatbot_experience(user_profile)} {chatbot_income(user_profile)} {chatbot_invest_length(user_profile)} "
        f"{chatbot_risk(user_profile)} {chatbot_loss(user_profile)} {chatbot_invest_type(user_profile)}. "
        "If the news would have a positive effect on the person, say: 'This has a positive impact'. "
        "If the news would have a negative effect, say: 'This has a negative impact'."
    )

    summaries = []
    for article in articles:
        # Handle missing 'article_summary' by using an alternative or fallback
        article_title = article.get('article_title', 'No Title Available')  # Fallback for missing title
        article_summary = article.get('article_summary', 'Summary not available')  # Fallback for missing summary
        article_url = article.get('article_url', 'URL not available')  # Fallback for missing URL

        # Construct the content for GPT-3.5
        content = f"Title: {article_title}\nSummary: {article_summary}\nURL: {article_url}"
        
        # Call the LLM with the article content and the user's profile
        messages = [
            {"role": "system", "content": instruction},
            {"role": "user", "content": content}
        ]
        
        # Get GPT-3.5 response (pseudo-code, depends on your actual integration)
        response = get_llm_response(messages, max_response_tokens=300)
        summary = response.choices[0].message.content.strip()
        summaries.append(summary)

    return summaries


def main(user_email, stock):
    # Step 1: Fetch the user responses from the /next/user-responses API
    user_profile = fetch_user_profile(user_email)
    if not user_profile:
        print(f"User profile not found for email: {user_email}")
        return

    # Step 2: Fetch news articles related to the stock
    news_articles = fetch_news_from_api(stock)
    if not news_articles:
        print(f"No recent news found for stock: {stock}")
        return

    # Step 3: Generate personalized summaries using GPT-3.5
    articles_with_summaries = generate_article_summaries(news_articles)

    # Step 4: Generate personalized summaries using GPT-3.5
    summaries = generate_llm_summary(articles_with_summaries, user_profile)

    # Print or store the summaries
    for summary in summaries:
        print(summary)
        


if __name__ == "__main__":
    main(user_email="vananhduong.vn@gmail.com", stock="BHP")  # Example usage