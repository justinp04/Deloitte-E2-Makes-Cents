'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Anna Duong, 
Purpose:    Scrape ASX company profile
Date:       15/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

import scrapy
import os
import json
import re
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient

class StockSpider(scrapy.Spider):
    name = 'company_profile'
    allowed_domains = ['stockanalysis.com']
    start_urls = ['https://stockanalysis.com/list/australian-securities-exchange/']
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
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
        for link in stock_links:
            stock_url = response.urljoin(link)
            yield scrapy.Request(stock_url, callback=self.parse_stock)

    def parse_stock(self, response):
        ticker = response.url.split('/')[5]
        print(f'Processing ticker: {ticker}')

        # Updated company profile URL format
        profile_url = f'https://stockanalysis.com/quote/asx/{ticker}/company/'

        # Request the company profile
        yield scrapy.Request(profile_url, callback=self.parse_profile, meta={'ticker': ticker})

    def parse_profile(self, response):
        ticker = response.meta['ticker']

        # Extract the company profile URL
        profile_url = response.url

        # Extract company profile information
        profile = {
            'ticker': ticker,
            'name': response.xpath('//*[@id="main"]/div[1]/div[1]/div[1]/div[1]/text()').get(),
            'founded': response.xpath('//*[@id="main"]/div[2]/div[2]/div[1]/table/tbody/tr[2]/td[2]/text()').get(),
            'sector': response.xpath('//*[@id="main"]/div[2]/div[2]/div[1]/table/tbody/tr[4]/td[2]/a//text()').get(),
            'industry': response.xpath('//*[@id="main"]/div[2]/div[2]/div[1]/table/tbody/tr[3]/td[2]/a//text()').get(),
            'CEO': response.xpath('//*[@id="main"]/div[2]/div[2]/div[1]/table/tbody/tr[6]/td[2]//text()').get(),
            'description': self.clean_html(response.xpath('//*[@id="main"]/div[2]/div[1]/div').get()),
            'url': profile_url,
        }

        # Save the profile data to a file
        self.save_profile_to_blob(ticker, profile)


    def save_profile_to_blob(self, ticker, profile):
        # Format profile data as a text string
        profile_text = f"""
            Ticker: {profile.get('ticker', 'N/A')}
            Name: {profile.get('name', 'N/A')}
            Founded: {profile.get('founded', 'N/A')}
            Sector: {profile.get('sector', 'N/A')}
            Industry: {profile.get('industry', 'N/A')}
            CEO: {profile.get('CEO', 'N/A')}
            Description: {profile.get('description', 'N/A')}
            Profile URL: {profile.get('url', 'N/A')}
        """

        # Convert profile data to bytes
        profile_bytes = profile_text.strip().encode('utf-8')

        # Create a blob client
        blob_client = self.container_client.get_blob_client(f'{ticker}-profile.txt')

        # Upload the profile data to the blob
        blob_client.upload_blob(profile_bytes, overwrite=True)

    def clean_html(self, html):
        # Clean HTML tags using regex
        if html:
            clean = re.compile('<.*?>')
            return re.sub(clean, '', html).strip()
        return 'N/A'
