import scrapy
import pandas as pd

class StockSpider(scrapy.Spider):
    name = 'stock_analysis'
    allowed_domains = ['stockanalysis.com']
    start_urls = ['https://stockanalysis.com/list/australian-securities-exchange/']
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
    }

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

        for key, url in urls.items():
            yield scrapy.Request(url=url, callback=self.parse_financial, meta={'sheet_name': key, 'ticker': ticker})

    def parse_financial(self, response):
        sheet_name = response.meta['sheet_name']
        ticker = response.meta['ticker']
        tables = pd.read_html(response.text, attrs={'data-test': 'financials'})

        for i, table in enumerate(tables):
            yield {
                'ticker': ticker,
                'sheet_name': f"{sheet_name} {i}" if len(tables) > 1 else sheet_name,
                'data': table
            }