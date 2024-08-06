import requests
import os
import yfinance as yf

# Your API key
API_KEY = 'aSFV2BaLN9XnBc35RAfTax2pA2zIGqKY'

# List of all Australian Stock Markets
symbols = ['CBA', 'BHP', 'RIO', 'CSL', 'NAB', 'WBC', 'ANZ', 'WES', 'MQG', 'GMG', 'FMG', 'WDS', 'RMD', 'TLS', 'WOW', 'TCL', 'ALL', 'WTC', 'QBE', 'REA', 'STO', 'COL', 'JHX', 'AMC', 'SUN', 'COH', 'BXB', 'XRO', 'ORG', 'SCG', 'REH', 'IAG', 'FPH', 'CPU', 'NST', 'SVW', 'PME', 'S32', 'SHL', 'CAR', 'SOL', 'ASX', 'TLC', 'SGP', 'MPL', 'RHC', 'MIN', 'QAN', 'APA', 'NXT', 'TWE', 'EDV', 'BSL', 'VCX', 'YAL', 'AFI', 'GPT', 'PLS', 'TPG', 'GQG', 'ORI', 'MGR', 'WOR', 'ALD', 'SEK', 'EVN', 'JBH', 'ALX', 'DXS', 'SDF', 'BEN', 'AGL', 'AZJ', 'TNE', 'WHC', 'TLX', 'CHC', 'HVN', 'LYC', 'IPL', 'FLT', 'LLC', 'AWC', 'IGO', 'IEL', 'BOQ', 'NHC', 'HUB', 'SFR', 'VNT', 'SUL', 'PDN', 'AMP', 'BFL', 'ILU', 'NEU', 'DRR', 'SGM', 'CTD', 'IFL', 'MFG', 'KAR', 'DYL', 'CCP', 'TPW', 'OML', 'QRI', 'ADH', 'EML', 'GNG', 'DUG', 'WC8', 'KSL', 'TPC', 'PPE', 'AXI']

# Function to get full quote for a stock from FMP
def get_full_quote_fmp(symbol):
    url = f'https://financialmodelingprep.com/api/v3/quote/{symbol}?apikey={API_KEY}'
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check for HTTP errors
        data = response.json()
        if data and isinstance(data, list) and len(data) > 0:
            return data
        else:
            print(f'No data returned from FMP for symbol {symbol}')
            return None
    except requests.RequestException as e:
        print(f'Error fetching data from FMP for symbol {symbol}: {e}')
        return None

# Function to get full quote for a stock from Yahoo Finance
def get_full_quote_yf(symbol):
    ticker = yf.Ticker(symbol)
    data = ticker.info
    if data:
        return [data]
    else:
        print(f'No data returned from Yahoo Finance for symbol {symbol}')
        return None

# Function to save data to a .txt file
def save_to_txt(data, directory, filename):
    if not os.path.exists(directory):
        os.makedirs(directory)

    file_path = os.path.join(directory, filename)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(str(data))  # Convert data to a string representation for saving

# Directory to save the quotes
directory = 'full_quote'

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
        save_to_txt(full_quote, directory, filename)
        print(f'Saved data for {symbol} to {filename}')
    else:
        print(f'No data to save for {symbol}')