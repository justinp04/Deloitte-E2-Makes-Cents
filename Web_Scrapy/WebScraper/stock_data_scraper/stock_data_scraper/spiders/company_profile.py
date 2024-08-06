import scrapy
import os
import json
import re

class StockSpider(scrapy.Spider):
    name = 'company_profile'
    allowed_domains = ['stockanalysis.com']
    start_urls = ['https://stockanalysis.com/list/australian-securities-exchange/']
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
    }

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

        # Extract company profile information
        profile = {
            'ticker': ticker,
            'name': response.xpath('//*[@id="main"]/div[1]/div[1]/div[1]/div[1]/text()').get(),
            'founded': response.xpath('//*[@id="main"]/div[2]/div[2]/div[1]/table/tbody/tr[2]/td[2]/text()').get(),
            'sector': response.xpath('//*[@id="main"]/div[2]/div[2]/div[1]/table/tbody/tr[4]/td[2]/a//text()').get(),
            'industry': response.xpath('//*[@id="main"]/div[2]/div[2]/div[1]/table/tbody/tr[3]/td[2]/a//text()').get(),
            'CEO': response.xpath('//*[@id="main"]/div[2]/div[2]/div[1]/table/tbody/tr[6]/td[2]//text()').get(),
            'description': self.clean_html(response.xpath('//*[@id="main"]/div[2]/div[1]/div').get()),
        }

        # Save the profile data to a file
        self.save_profile(ticker, profile)

    def save_profile(self, ticker, profile):
        # Ensure the directory exists
        if not os.path.exists('raw_company_profile'):
            os.makedirs('raw_company_profile')

        # Format profile data as a text string
        profile_text = f"""
            Ticker: {profile.get('ticker', 'N/A')}
            Name: {profile.get('name', 'N/A')}
            Founded: {profile.get('founded', 'N/A')}
            Sector: {profile.get('sector', 'N/A')}
            Industry: {profile.get('industry', 'N/A')}
            CEO: {profile.get('CEO', 'N/A')}
            Description: {profile.get('description', 'N/A')}
            """

        # Save profile data to a file
        file_path = os.path.join('raw_company_profile', f'{ticker}.txt')
        with open(file_path, 'a', encoding='utf-8') as file:
            file.write(profile_text.strip())

    def clean_html(self, html):
        # Clean HTML tags using regex
        if html:
            clean = re.compile('<.*?>')
            return re.sub(clean, '', html).strip()
        return 'N/A'
