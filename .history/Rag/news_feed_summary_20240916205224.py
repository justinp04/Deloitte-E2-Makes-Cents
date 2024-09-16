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

