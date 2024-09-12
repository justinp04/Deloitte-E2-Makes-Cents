import json
import logging
import azure.functions as func

import os
import requests
import yfinance as yf

from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from scraped_stock import scraped_stock

app = func.FunctionApp()

# Register the blueprint
app.register_functions(scraped_stock)

# Azure Blob Storage connection string
CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=stockdatascrape;AccountKey=Sg1ioSfzwWybd5qh1C15IS1TmuhAaDDEAvajAybblFYKqMPE6qyPbzb4u4a1B0G+ES8fo4pAieFH+ASt/D17bQ==;EndpointSuffix=core.windows.net'
CONTAINER_NAME = 'stockdatascrape'


@app.schedule(schedule="0 0 0 * * *", arg_name="myTimer", run_on_startup=True,
              use_monitor=False) 

def TimerTrigerFullQuotesAPI(myTimer: func.TimerRequest) -> None:
    if myTimer.past_due:
        logging.info('The timer is past due!')

    run()
    logging.info('Python timer trigger function executed.')


API_KEY = 'aSFV2BaLN9XnBc35RAfTax2pA2zIGqKY'

# Function to get full quote for a stock from FMP
def get_full_quote_fmp(symbol):
    symbol_with_suffix = f'{symbol}.AX'
    url = f'https://financialmodelingprep.com/api/v3/quote/{symbol_with_suffix}?apikey={API_KEY}'
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check for HTTP errors
        data = response.json()
        if data and isinstance(data, list) and len(data) > 0:
            return data
        else:
            print(f'No data returned from FMP for symbol {symbol_with_suffix}')
            return None
    except requests.RequestException as e:
        print(f'Error fetching data from FMP for symbol {symbol_with_suffix}: {e}')
        return None

# Function to get full quote for a stock from Yahoo Finance
def get_full_quote_yf(symbol):
    symbol_with_suffix = f'{symbol}.AX'
    ticker = yf.Ticker(symbol_with_suffix)
    data = ticker.info
    if data:
        return [data]
    else:
        print(f'No data returned from Yahoo Finance for symbol {symbol_with_suffix}')
        return None

def save_to_blob(data, container_name, filename):
    # Initialize BlobServiceClient
    blob_service_client = BlobServiceClient.from_connection_string(CONNECTION_STRING)
    container_client = blob_service_client.get_container_client(container_name)

    if not container_client.exists():
        container_client.create_container()

    blob_client = container_client.get_blob_client(filename)

    try:
        # Download existing blob content
        existing_blob = blob_client.download_blob()
        existing_data = existing_blob.readall().decode('utf-8')
    except Exception as e:
        # If the blob doesn't exist, we set existing_data to an empty string
        existing_data = ""
        logging.info(f'Blob not found or error occurred while downloading: {e}')

    # Format the new data
    new_data = json.dumps(data, indent=4)
    formatted_data = f"\n\n{new_data}"  # Add empty lines between old and new data

    # Append the new data
    updated_data = existing_data + formatted_data

    # Upload the updated content
    blob_client.upload_blob(updated_data, overwrite=True)
    logging.info(f'Saved data for {filename} to blob storage')

# Main function to run the process
def run():
    # Directory to save the quotes
    directory = 'full_quote'

    # List of all Australian Stock Markets
    symbols = ['CBA', 'BHP', 'RIO', 'CSL', 'NAB', 'WBC', 'ANZ', 'WES', 'MQG', 'GMG', 'FMG', 'WDS', 'RMD', 'TLS', 'WOW', 'TCL', 'ALL', 'WTC', 'QBE', 'REA', 'STO', 'COL', 'JHX', 
               'AMC', 'SUN', 'COH', 'BXB', 'XRO', 'ORG', 'SCG', 'REH', 'IAG', 'FPH', 'CPU', 'NST', 'SVW', 'PME', 'S32', 'SHL', 'CAR', 'SOL', 'ASX', 'TLC', 'SGP', 'MPL', 'RHC', 
               'MIN', 'QAN', 'APA', 'NXT', 'TWE', 'EDV', 'BSL', 'VCX', 'YAL', 'AFI', 'GPT', 'PLS', 'TPG', 'GQG', 'ORI', 'MGR', 'WOR', 'ALD', 'SEK', 'EVN', 'JBH', 'ALX', 'DXS', 
               'SDF', 'BEN', 'AGL', 'AZJ', 'TNE', 'WHC', 'TLX', 'CHC', 'HVN', 'LYC', 'IPL', 'FLT', 'LLC', 'AWC', 'IGO', 'IEL', 'BOQ', 'NHC', 'HUB', 'SFR', 'VNT', 'SUL', 'PDN', 
               'AMP', 'BFL', 'ILU', 'NEU', 'DRR', 'SGM', 'CTD', 'IFL', 'MFG', 'KAR', 'DYL', 'CCP', 'TPW', 'OML', 'QRI', 'ADH', 'EML', 'GNG', 'DUG', 'WC8', 'KSL', 'TPC', 'PPE', 'AXI']

    

    # Fetch and save quotes for each symbol
    for symbol in symbols:
        full_quote = get_full_quote_fmp(symbol)

        # If FMP data is empty, fallback to Yahoo Finance
        if not full_quote:
            print(f'Fallback to Yahoo Finance for symbol {symbol}')
            full_quote = get_full_quote_yf(symbol)

        # Only save if data is returned
        if full_quote:
            filename = f'{symbol}_full_quote.txt'
            save_to_blob(full_quote, CONTAINER_NAME, filename)
            print(f'Saved data for {symbol} to {filename}')
        else:
            print(f'No data to save for {symbol}')