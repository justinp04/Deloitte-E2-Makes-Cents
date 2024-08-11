from io import StringIO
import scrapy
import pandas as pd
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient


class StockSpider(scrapy.Spider):
    name = 'stock_analysis'
    allowed_domains = ['stockanalysis.com']
    start_urls = ['https://stockanalysis.com/list/australian-securities-exchange/']
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize Azure Blob Storage client
        connection_string = 'DefaultEndpointsProtocol=https;AccountName=stockfullquotesapi;AccountKey=HmVGx3RXJwRHNTk7ONCW1guuWty7cuXQXIvcNsDI9Viw8R2oGjsW1udji4NJGSef7buuHhUHWrAm+AStWIlGMw==;EndpointSuffix=core.windows.net'
        self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        self.container_name = 'stockfullquotesapi'

        # Ensure the container exists
        self.container_client = self.blob_service_client.get_container_client(self.container_name)
        if not self.container_client.exists():
            self.container_client.create_container()
            self.logger.info(f'Created container: {self.container_name}')
        else:
            self.logger.info(f'Container already exists: {self.container_name}')

    def parse(self, response):
        # Extract links to individual stock pages using XPath
        stock_links = response.xpath('//*[@id="main-table"]/tbody/tr/td[2]/a/@href').getall()
        for link in stock_links:
            stock_url = response.urljoin(link + 'financials/')
            yield scrapy.Request(stock_url, callback=self.parse_stock)

    def parse_stock(self, response):
        ticker = response.url.split('/')[5]
        self.logger.info(f'Processing ticker: {ticker}')
        urls = {
            'income annually': response.url,
            'income quarterly': response.url + '?p=quarterly',
            'balance sheet annually': response.url.replace('financials/', 'financials/balance-sheet/'),
            'balance sheet quarterly': response.url.replace('financials/', 'financials/balance-sheet/?p=quarterly'),
            'cash flow annually': response.url.replace('financials/', 'financials/cash-flow-statement/'),
            'cash flow quarterly': response.url.replace('financials/', 'financials/cash-flow-statement/?p=quarterly'),
            'ratio annually': response.url.replace('financials/', 'financials/ratios/'),
            'ratio quarterly': response.url.replace('financials/', 'financials/ratios/?p=quarterly')
        }

        for key, url in urls.items():
            yield scrapy.Request(url=url, callback=self.parse_financial, meta={'sheet_name': key, 'ticker': ticker})

    def parse_financial(self, response):
        sheet_name = response.meta['sheet_name']
        ticker = response.meta['ticker']

        # Wrap the response text in a StringIO object
        html_content = StringIO(response.text)

        tables = pd.read_html(html_content, attrs={'data-test': 'financials'})

        for i, table in enumerate(tables):
            formatted_sheet_name = f"{sheet_name} {i}" if len(tables) > 1 else sheet_name
            content = self.prepare_content(ticker, formatted_sheet_name, table)
            self.upload_to_blob(f'Financial-Statement-{ticker}.md', content)

    def prepare_content(self, ticker, sheet_name, df):
        # Clean and format the data
        df = self.clean_data(df)
        markdown_data = df.to_markdown(index=False)

        # Combine markdown data into content
        content = f"## {sheet_name}\n{markdown_data}\n\n"
        self.logger.info(f'Prepared content for {ticker}: {content}')
        return content

    def clean_data(self, df):
        # Attempt to convert all columns to numeric, except the first column
        for col in df.columns[1:]:
            df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', '').str.replace('%', '').str.strip(), errors='coerce')  # Clean and convert data
        return df

    def upload_to_blob(self, file_path, content):
        blob_client = self.container_client.get_blob_client(file_path)
        
        try:
            # Check if blob exists
            existing_content = ""
            if blob_client.exists():
                self.logger.info(f'Blob {file_path} already exists. Downloading existing content.')
                existing_content = blob_client.download_blob().readall().decode('utf-8')

            # Append the new content to existing content
            combined_content = existing_content + content

            # Upload the content to the blob
            self.logger.info(f'Uploading combined content to {file_path}')
            blob_client.upload_blob(combined_content.encode('utf-8'), overwrite=True)
            self.logger.info(f'Successfully saved financial data to {file_path} in Blob Storage')
        except Exception as e:
            self.logger.error(f"Failed to upload blob: {str(e)}")