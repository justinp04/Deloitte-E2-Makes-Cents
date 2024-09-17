import mysql.connector
import requests

API_URL = 'http://localhost:4000/news'


def fetch_user_profile(user_id):
    connection = mysql.connector.connect(
        host="your-database-host",
        user="your-database-user",
        password="your-database-password",
        database="your-database-name"
    )
    
    cursor = connection.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM user_profiles WHERE user_id = {user_id}")
    
    user_profile = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    return user_profile if user_profile else None



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

from openai import OpenAI

def generate_gpt3_summary(articles, user_profile):
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
        content = f"Title: {article['article_title']}\nContent: {article['article_summary']}"
        
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