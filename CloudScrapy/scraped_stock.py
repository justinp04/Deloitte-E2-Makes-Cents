import azure.functions as func
import logging

from Web_Scrapy.WebScraper.stock_data_scraper.stock_data_scraper.spiders.company_profile import StockSpider as CompanyProfileSpider
from scrapy.crawler import CrawlerProcess

scraped_stock = func.Blueprint()


@scraped_stock.route(route="ScrapedStockData", auth_level=func.AuthLevel.ANONYMOUS)
def ScrapedStockData(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    process = CrawlerProcess()
    process.crawl(CompanyProfileSpider)
    process.start()
    return func.HttpResponse(f"This HTTP triggered function executed successfully.")


@scraped_stock.schedule(schedule="0 0 0 * * *", arg_name="myTimer1", run_on_startup=True)
def TimerTriggerScrapedStockData(myTimer1: func.TimerRequest) -> None:
    if myTimer1.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function started.')

    process = CrawlerProcess()
    process.crawl(CompanyProfileSpider)
    process.start()

    logging.info('Python timer trigger function completed successfully.')