'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Anna Duong, 
Purpose:    Scrape ASX company daily news 
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

import scrapy
import pandas as pd
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient

class StockSpider(scrapy.Spider):
    name = 'stocknews_yahoofinance'
    allowed_domains = ['stockanalysis.com', "finance.yahoo.com"]
    start_urls = ['https://stockanalysis.com/list/australian-securities-exchange/']
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
        'REDIRECT_ENABLED': True,
        'DOWNLOAD_DELAY': 1,
        'CONCURRENT_REQUESTS': 5,  # Limit the number of concurrent requests
        'CONCURRENT_REQUESTS_PER_DOMAIN': 2,  # Limit requests per domain
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize Azure Blob Storage client
        connection_string = 'DefaultEndpointsProtocol=https;AccountName=stockdatascrape;AccountKey=Sg1ioSfzwWybd5qh1C15IS1TmuhAaDDEAvajAybblFYKqMPE6qyPbzb4u4a1B0G+ES8fo4pAieFH+ASt/D17bQ==;EndpointSuffix=core.windows.net'
        self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        self.container_name = 'stockdata'

        # Ensure the container exists
        self.container_client = self.blob_service_client.get_container_client(self.container_name)
        if not self.container_client.exists():
            self.container_client.create_container()


    def parse(self, response):
        # Extract links to individual stock pages using XPath
        stock_links = response.xpath('//*[@id="main-table"]/tbody/tr/td[2]/a/@href').getall()
        # i = 0
        for link in stock_links:
            # i += 1
            # if i < 30 or i > 60:
            #     continue
            stock_url = response.urljoin(link + 'financials/')
            ticker = link.split('/')[3]
            news_url = f'https://finance.yahoo.com/quote/' + ticker + '.AX/news/'
            yield scrapy.Request(news_url, callback=self.parse_news, meta={'company_name': ticker})


    def parse_news(self, response):
        news_links = response.xpath('//li//a[contains(@class, "subtle-link fin-size-small titles noUnderline  yf-13p9sh2")]/@href').extract()
        for link in news_links:
            yield scrapy.Request(link, callback=self.parse_news_content, meta=response.meta)


    def parse_news_content(self, response):
        title = response.xpath('//h1[@id="caas-lead-header-undefined" and @data-test-locator="headline"]/text()').get() 
        time = response.xpath('//time/@datetime').get()
        paragraphs = response.xpath('//article//p//text()').extract()

        # Extract all possible image URLs from the article
        image_urls = response.xpath('//img/@src').getall()

        # Filter the image URLs to remove any tracking images or ads (optional)
        filtered_image_urls = [url for url in image_urls if 'https' in url and 'yimg' in url]

        # Pick the best image (if available) - for now, just take the first valid one
        image_url = filtered_image_urls[0] if filtered_image_urls else None
        
        
        if title and time:
            content = title + " " + time + '\n\n' + '\n'.join(paragraphs)
            company_name = response.meta['company_name']
            scraped_url = response.url 
            content += '\n\nScraped from: ' + scraped_url

            # Store image and add its URL to the content
            if image_url:
                content += f'\nTitle Image URL: {image_url}\n'

            file_name = f'{company_name}-news.txt'
            
            # Save content to Azure Blob Storage
            self.save_to_blob(file_name, content)
    
    def save_to_blob(self, file_name, content):
        # Convert content to bytes
        content_bytes = content.encode('utf-8')

        # Create a blob client
        blob_client = self.container_client.get_blob_client(file_name)

        # Append new content to the existing file in the blob (if it exists)
        try:
            # Download existing blob content
            existing_blob = blob_client.download_blob()
            existing_data = existing_blob.readall().decode('utf-8')
            content_bytes = (existing_data + '\n' + '='*80 + '\n\n' + content).encode('utf-8')
        except Exception as e:
            # If the blob doesn't exist, we'll just upload the new content
            pass

        # Upload the content to the blob
        blob_client.upload_blob(content_bytes, overwrite=True)
        print(f'Saved news content for {file_name} to Blob Storage')

    # def save_to_blob(self, file_name, content):
    #     # Convert content to bytes
    #     content_bytes = content.encode('utf-8')

    #     # Create a blob client
    #     blob_client = self.container_client.get_blob_client(file_name)

    #     # Upload the content to the blob, overwriting the existing content
    #     blob_client.upload_blob(content_bytes, overwrite=True)

    #     print(f'Successfully saved news content for {file_name} to Blob Storage')