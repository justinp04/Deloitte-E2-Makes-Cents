from user_queries import query_qdrant, get_llm_response, generate_references
from prompt_engineering import chatbot_experience, chatbot_income, chatbot_invest_length, chatbot_risk, chatbot_loss, chatbot_invest_type
import datetime

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides the news feed feature to
            provide personalised summaries of relevant 
            news to users 
Date:       05/09/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    stocks = get_fav_stock()  #list of favorite stocks
    
    for stock in stocks:  #cycle through each fav stock
        user_query = f"Has {stock} had a news article published today?"
        documents = query_qdrant_for_news(stock)  
        
        if documents:
            answer = generate_response(documents, user_query)
            references = generate_references(documents)
            print(f"Stock: {stock}\n{answer}")
            print(f"References:\n{references}\n")
        else:
            print(f"No recent news for {stock}.\n")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: get_fav_stock
IMPORT: none
EXPORT: list of stocks
PURPOSE: Retrieves the favorite stocks from the SQL 
         database for the user.
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_fav_stock():
    #this is where a list of fav stocks would need to be fetched from sql database

    fav_stocks = ["Woolworths", "Adairs", "Westfarmers", "BHP"] #this is just for testing purposes until it gets hooked up to sql

    return fav_stocks


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: query_qdrant_for_news
IMPORT: stock
EXPORT: list of documents
PURPOSE: Queries Qdrant for news articles related to 
         the stock that were published today.
'''''''''''''''''''''''''''''''''''''''''''''''''''
def query_qdrant_for_news(stock):
    today = datetime.datetime.now().strftime('%Y-%m-%d')  #get today's date
    user_query = f"{stock} news {today}"  #query Qdrant for news related to the stock and today's date
    documents = query_qdrant(user_query) 
    return [doc for doc in documents if 'news' in doc['metadata']['source']]  #get only news from blog storage following STOCK-news.txt format


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: generate_response
IMPORT: documents, user_query
EXPORT: response
PURPOSE: Generates a custom summary response to be
         provided to the user based on the news 
         articles.
'''''''''''''''''''''''''''''''''''''''''''''''''''
def generate_response(documents, user_query):
    context = "\n".join([doc['content'] for doc in documents])

    messages = [
    {
        "role": "system",
        "content": (
            "You are a financial assistant providing personalised summaries about current news events."
            f"You need to provide a short summary of the main points of the artcile, and about how the news article would affect the investment choices of someone who is a {chatbot_experience()} {chatbot_income()} {chatbot_invest_length()} {chatbot_risk()} {chatbot_loss()} {chatbot_invest_type()}."
            "If the news would have a positive affect on the person you are providing assistance to, say: 'This has a positive impact'"
            "If the news would have a negative affect on the person you are providing assistance to, say: 'This has a negative impact'"
        )
    },
    {
        "role": "user",
        "content": f"Context:\n{context}\n\nUser Query:\n{user_query}"
    }
    ]

    max_response_tokens = 300
    response = get_llm_response(messages, max_response_tokens)
    return response.choices[0].message.content.strip()


if __name__ == "__main__":
    main()
