import csv, io
from fuzzywuzzy import process
from load_clients import load_blob_client
from io import StringIO
import os


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Gwyneth Gardiner, 
Purpose:    Deloitte E2 Capstone Project - Makes Cents
            This file provides the functionality for a 
            user to be able to search stock names without
            needing to know the ticker name
Date:       03/10/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: get_stock_ticker
IMPORT: user_input
EXPORT: stock_ticker
PURPOSE: gets the ticker name from the user input
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_stock_ticker(user_input):

    container_client = load_blob_client()

    blob_client = container_client.get_blob_client("asx_stocks.csv")
    stream_downloader = blob_client.download_blob()
    
    asx_stocks = {}
    with io.StringIO(stream_downloader.content_as_text(encoding='utf-8-sig')) as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            asx_stocks[row['stock_name']] = row['ticker']

    #asx_stocks = load_asx_stocks()  
    stock_ticker = get_stock_name(user_input, asx_stocks)

    #if stock_ticker:
    #    print(f"Stock ticker found: {stock_ticker}")
    #else:
    #    print(f"Stock '{user_input}' not found!")

    return stock_ticker


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: load_asx_stocks
IMPORT: none
EXPORT: asx_stocks
PURPOSE: load ASX stocks from a CSV file
'''''''''''''''''''''''''''''''''''''''''''''''''''
def load_asx_stocks():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'asx_stocks.csv')
    
    asx_stocks = {}
    with open(csv_path, mode='r', encoding='utf-8-sig') as file:
        reader = csv.DictReader(file)
        for row in reader:
            asx_stocks[row['stock_name']] = row['ticker']
    return asx_stocks


'''''''''''''''''''''''''''''''''''''''''''''''''''
METHOD: get_stock_name
IMPORT: user_input, asx_stocks
EXPORT: stock_ticker
PURPOSE: fuzzy match user input to stock names and
        get the corresponding ticker
Last modified by Anna: get stock name returns a dictionary with both name and ticker        
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_stock_name(user_input, asx_stocks):

    user_input_normalised = user_input.strip().upper()

    if user_input_normalised in asx_stocks.values(): # check if the user just entered the ticker name anyway
        # Find the full company name from the ticker
        stock_name = [key for key, value in asx_stocks.items() if value == user_input_normalised]
        if stock_name:
            return {"name": stock_name[0], "ticker": user_input_normalised}

    exact_matches = [stock for stock in asx_stocks if user_input.lower() in stock.lower()] # try an exact substring match
    if exact_matches:
        return {"name": exact_matches[0], "ticker": asx_stocks[exact_matches[0]]}

    stock_name, similarity = process.extractOne(user_input, asx_stocks.keys()) # get best match using fuzzy
    if similarity >= 60: # can change this threshold for the similarity
        stock_ticker = asx_stocks[stock_name]
        return {"name": stock_name, "ticker": stock_ticker}
    else:
        print(f"No stock found matching '{user_input}'")
        return None