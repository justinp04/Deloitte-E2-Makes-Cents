import scrapy
from ..items import StockDataScraperItem


class YahooScraperSpider(scrapy.Spider):
    name = "yahoo_scraper"

    def start_requests(self):
        urls = ['https://finance.yahoo.com/most-active/']
        for url in urls:
            yield scrapy.Request(url=url, callback=self.get_stocks)

    def get_stocks(self, response):
        #Get all the stock symbols
        stocks = response.xpath('//*[@id="scr-res-table"]/div[1]/table/tbody/tr/td[1]/a').css('::text').extract()

        for stock in stocks:
            # Follow the link the stock details page - because all stocks follow the same pattern
            yield scrapy.Request(url=f'https://finance.yahoo.com/quote/{stock}', callback=self.parse)

    def parse(self, response):
        # Declare the item objects
        items = StockDataScraperItem()

        # Save the extracted data in item objects
        items['stock_name'] = response.xpath('//*[@id="quote-header-info"]/div[2]/div[1]/div[1]/h1/text()').get()
        items['intraday_price'] = response.xpath('//*[@id="quote-header-info"]/div[3]/div[1]/div[1]/fin-streamer[1]/span/text()').get()
        items['price_change'] = response.xpath('//*[@id="quote-header-info"]/div[3]/div[1]/div[1]/fin-streamer[2]/text()').get()

        # Follow the link to the Financials page
        stock_symbol = response.url.split('/')[-1]
        financials_url = f'https://finance.yahoo.com/quote/{stock_symbol}/financials'
        yield scrapy.Request(url=financials_url, callback=self.parse_financials, meta={'items': items})

    def parse_financials(self, response):
        items = response.meta['items']

        # Scrape the Income Statement data
        income_statement_rows = response.xpath('//div[@data-test="fin-row"]')
        income_statement_data = {}
        for row in income_statement_rows:
            row_label = row.xpath('.//div[1]/span/text()').get()
            row_values = row.xpath('.//div[contains(@class, "Ta(end)")]//span/text()').extract()
            income_statement_data[row_label] = row_values

        items['income_statement'] = income_statement_data

        # Follow the link to the Balance Sheet page
        stock_symbol = response.url.split('/')[-2]
        balance_sheet_url = f'https://finance.yahoo.com/quote/{stock_symbol}/balance-sheet'
        yield scrapy.Request(url=balance_sheet_url, callback=self.parse_balance_sheet, meta={'items': items})

    def parse_balance_sheet(self, response):
        items = response.meta['items']

        # Scrape the Balance Sheet data
        balance_sheet_rows = response.xpath('//div[@data-test="fin-row"]')
        balance_sheet_data = {}
        for row in balance_sheet_rows:
            row_label = row.xpath('.//div[1]/span/text()').get()
            row_values = row.xpath('.//div[contains(@class, "Ta(end)")]//span/text()').extract()
            balance_sheet_data[row_label] = row_values

        items['balance_sheet'] = balance_sheet_data

        yield items