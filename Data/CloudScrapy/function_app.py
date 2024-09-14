import json
import logging
import azure.functions as func
import requests
import yfinance as yf
from azure.storage.blob import BlobServiceClient, ContainerClient
from io import StringIO
import csv
from scraped_stock import scraped_stock

app = func.FunctionApp()
app.register_functions(scraped_stock)

# Azure Blob Storage connection string and container
CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=stockdatascrape;AccountKey=Sg1ioSfzwWybd5qh1C15IS1TmuhAaDDEAvajAybblFYKqMPE6qyPbzb4u4a1B0G+ES8fo4pAieFH+ASt/D17bQ==;EndpointSuffix=core.windows.net'
CONTAINER_NAME = 'stockdata'

# Azure Function to trigger the data scraping every day at midnight
@app.schedule(schedule="0 0 0 * * *", arg_name="myTimer", run_on_startup=True, use_monitor=False) 
def TimerTrigerFullQuotesAPI(myTimer: func.TimerRequest) -> None:
    if myTimer.past_due:
        logging.warning('The timer is past due!')

    logging.info('Python timer trigger function started.')
    run()
    logging.info('Python timer trigger function executed successfully.')

# Function to get all ASX symbols dynamically
def get_all_asx_symbols():
    url = "https://www.asx.com.au/asx/research/ASXListedCompanies.csv"
    
    try:
        response = requests.get(url)
        response.raise_for_status()

        # Use csv.reader to parse the CSV
        csv_data = StringIO(response.text)
        csv_reader = csv.reader(csv_data)
        symbols = []
        next(csv_reader)  # Skip the header row

        for row in csv_reader:
            if len(row) > 1:  # Ensure the row has at least 2 columns
                asx_code = row[1].strip()  # ASX code is in the second column
                if asx_code:  # Ensure it's not empty
                    symbols.append(asx_code)
        
        return symbols

    except requests.RequestException as e:
        logging.error(f"Error fetching ASX symbols: {e}")
        return []

# Function to get full quote for a stock from Yahoo Finance
def get_full_quote_yf(symbol):
    symbol_with_suffix = f'{symbol}.AX'
    ticker = yf.Ticker(symbol_with_suffix)
    data = ticker.info
    if data:
        return data
    else:
        logging.warning(f'No data returned from Yahoo Finance for symbol {symbol_with_suffix}')
        return None

# Function to save data to Azure Blob Storage
def save_to_blob(data, container_name, filename):
    blob_service_client = BlobServiceClient.from_connection_string(CONNECTION_STRING)
    container_client = blob_service_client.get_container_client(container_name)

    if not container_client.exists():
        container_client.create_container()

    blob_client = container_client.get_blob_client(filename)

    # Format the new data as JSON
    new_data = json.dumps(data, indent=4)

    # Overwrite the blob with new data
    blob_client.upload_blob(new_data, overwrite=True)
    logging.info(f'Saved data for {filename} to blob storage')

# Main function to run the process
def run():
    # Fetch all ASX stock symbols dynamically
    symbols = get_all_asx_symbols()

    if not symbols:
        logging.error("No ASX symbols were fetched.")
        return

    # Fetch and save quotes for each symbol
    for symbol in symbols:
        try:
            # Get full quote from Yahoo Finance
            full_quote = get_full_quote_yf(symbol)
            
            if full_quote:
                filename = f'{symbol}_full_quote.txt'
                save_to_blob(full_quote, CONTAINER_NAME, filename)
                logging.info(f'Saved data for {symbol}')
            else:
                logging.info(f'No data to save for {symbol}')
        except Exception as e:
            logging.error(f'Error fetching or saving data for {symbol}: {str(e)}')
