from prompt_engineering import user_income, user_horizon, user_risk, user_loss, user_preference
from user_queries import get_llm_response
from load_clients import load_blob_client
import re

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides stock suggestions to the 
            user based on their profile questions
Date:       04/09/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

def main():
    container_client = load_blob_client()
    blob_names = []
    blob_list = container_client.list_blobs()
    
    for blob in blob_list:
        blob_names.append(blob.name)

    recommendations = get_recommendations()
    stock1, stock2, stock3 = parse_recommendations(recommendations)
    stocks = [stock1, stock2, stock3]

    stock_ticker_mapping = {}
    for stock in stocks:
        ticker = extract_stock_ticker(stock)
        stock_ticker_mapping[ticker] = stock
    
    #print(stock1, stock2, stock3)
    stock_tickers = list(stock_ticker_mapping.keys())  #extract stock tickers from recommendations
    
    valid_stocks = []    
    for ticker in stock_tickers:
        if any(ticker in blob_name for blob_name in blob_names):  #check if the ticker symbol is anywhere in the blob names
            valid_stocks.append(ticker)
    
    if valid_stocks:  #print valid stocks only
        for ticker in valid_stocks:
            original_stock_name = stock_ticker_mapping[ticker]
            print(original_stock_name)
    else:
        print("No valid stocks found in blob storage.")


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: get_recommendations
IMPORT: none
EXPORT: recommendations
PURPOSE: provides 3 recommended stocks to the user
        based on their user profile
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_recommendations():
    system_message = {
    "role": "system",
    "content": (
        "You are a financial assistant."
        f"Provide personalised investment recommendations of 3 ASX stocks {user_income()} {user_horizon()} {user_risk()} {user_loss()} {user_preference()}."
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


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: extract_stock_ticker
IMPORT: stock_name
EXPORT: ticker
PURPOSE: extracts the stock ticker from the recommendation
'''''''''''''''''''''''''''''''''''''''''''''''''''
def extract_stock_ticker(stock_name):
    match = re.search(r'\((\w+)\)', stock_name)
    if match:
        return match.group(1)  #return ticker symbol
    return stock_name  #return full name if no ticker is found


if __name__ == "__main__":
    main()