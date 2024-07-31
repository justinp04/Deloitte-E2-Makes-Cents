import scrapy
import pandas as pd
import os
class StockSpider(scrapy.Spider):
    name = 'stock_spider'
    allowed_domains = ['stockanalysis.com', "finance.yahoo.com"]
    start_urls = ['https://stockanalysis.com/list/australian-securities-exchange/']
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
    }

    def parse(self, response):
        # Extract links to individual stock pages using XPath
        stock_links = response.xpath('//*[@id="main-table"]/tbody/tr/td[2]/a/@href').getall()
        for link in stock_links:
            stock_url = response.urljoin(link + 'financials/')
            # yield scrapy.Request(stock_url, callback=self.parse_stock)
            ticker = link.split('/')[3]
            news_url = f'https://finance.yahoo.com/quote/' + ticker + '.AX/news';
            yield scrapy.Request(news_url, callback=self.parse_news, meta={'company_name': ticker})


    def parse_news(self, response):
        news_links = response.xpath('//li//a[contains(@class, "subtle-link fin-size-small titles noUnderline  yf-13p9sh2")]/@href').extract()
        for link in news_links:
            yield scrapy.Request(link, callback=self.parse_news_content, meta=response.meta)


    def parse_news_content(self, response):
        title = response.xpath('//h1[@id="caas-lead-header-undefined" and @data-test-locator="headline"]/text()').get()
        paragraphs = response.xpath('/html/body/div[2]/div/div/div/main/div/div[1]/div/div/div/div/div/article/div/div/div/div/div/div/div[2]/div[2]/p/text()').extract()
        if not os.path.exists('news'):
            os.makedirs('news')
        content = title + '\n\n' + '\n'.join(paragraphs)
        company_name = response.meta['company_name']
        file_path = f'news/{company_name}.txt'
        with open(file_path, 'a', encoding='utf-8') as f:
            f.write(content)
            f.write('\n' + '='*80 + '\n\n')