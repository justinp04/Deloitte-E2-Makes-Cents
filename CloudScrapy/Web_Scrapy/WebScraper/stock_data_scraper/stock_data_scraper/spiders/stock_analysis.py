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

        # To store financial data as Markdown
        self.financial_data = {}

    def parse(self, response):
        # Extract links to individual stock pages using XPath
        stock_links = response.xpath('//*[@id="main-table"]/tbody/tr/td[2]/a/@href').getall()
        for link in stock_links:
            stock_url = response.urljoin(link + 'financials/')
            yield scrapy.Request(stock_url, callback=self.parse_stock)

    def parse_stock(self, response):
        ticker = response.url.split('/')[5]
        print(f'Processing ticker: {ticker}')
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

        # Pass the number of URLs through meta so it's available in parse_financial
        for key, url in urls.items():
            yield scrapy.Request(url=url, callback=self.parse_financial, meta={'sheet_name': key, 'ticker': ticker, 'total_urls': len(urls)})


    def parse_financial(self, response):
        sheet_name = response.meta['sheet_name']
        ticker = response.meta['ticker']
        total_urls = response.meta['total_urls']
        tables = pd.read_html(response.text, attrs={'data-test': 'financials'})

        if ticker not in self.financial_data:
            self.financial_data[ticker] = {}

        for i, table in enumerate(tables):
            formatted_sheet_name = f"{sheet_name} {i}" if len(tables) > 1 else sheet_name
            markdown_data = table.to_markdown(index=False)
            self.financial_data[ticker][formatted_sheet_name] = markdown_data

        # Check if we've collected all financial data for this ticker
        if len(self.financial_data[ticker]) == total_urls:
            self.save_to_blob(ticker, self.financial_data[ticker])

    def save_to_blob(self, ticker, financial_data):
        # Create a Markdown file content
        markdown_content = f"# Financial Data for {ticker}\n\n"
        for sheet_name, data in financial_data.items():
            markdown_content += f"## {sheet_name}\n\n"
            markdown_content += data + "\n\n"

        # Convert markdown content to bytes
        markdown_bytes = markdown_content.encode('utf-8')

        # Create a blob client
        blob_client = self.container_client.get_blob_client(f'{ticker}-financial-data.md')

        # Upload the markdown content to the blob
        blob_client.upload_blob(markdown_bytes, overwrite=True)
        print(f'Saved financial data for {ticker} to {ticker}-financial-data.md in Blob Storage')