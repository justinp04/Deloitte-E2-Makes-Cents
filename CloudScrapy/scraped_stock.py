
import azure.functions as func
import logging

from Web_Scrapy.WebScraper.stock_data_scraper.stock_data_scraper.spiders.company_profile import StockSpider as CompanyProfileSpider
from scrapy.crawler import CrawlerProcess

scraped_stock = func.Blueprint()


@scraped_stock.route(route="ScrapedStockData", auth_level=func.AuthLevel.ANONYMOUS)
def ScrapedStockData(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    logging.info('Python HTTP trigger function processed a request.')
    process = CrawlerProcess()
    process.crawl(CompanyProfileSpider)
    process.start()
    return func.HttpResponse(f"This HTTP triggered function executed successfully.")