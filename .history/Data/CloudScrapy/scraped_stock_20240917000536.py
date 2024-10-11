'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Anna Duong, 
Purpose:    Timer Trigger Function to scrape New
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

import azure.functions as func
import logging

from Web_Scrapy.WebScraper.stock_data_scraper.stock_data_scraper.spiders.company_profile import StockSpider as CompanyProfileSpider
from Web_Scrapy.WebScraper.stock_data_scraper.stock_data_scraper.spiders.stock_analysis import StockSpider as StockAnalysisSpider
from Web_Scrapy.WebScraper.stock_news.stock_news.spiders.stocknews_yahoofinance import StockSpider as StockNews

from scrapy.crawler import CrawlerProcess

scraped_stock = func.Blueprint()


# Runs every day at midnight
@scraped_stock.schedule(schedule="0 0 0 * * *", arg_name="myTimer1", run_on_startup=True)
def TimerTriggerScrapedStockData(myTimer1: func.TimerRequest) -> None:
    if myTimer1.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function started.')

    process = CrawlerProcess()
    process.crawl(CompanyProfileSpider)
    process.crawl(StockNews)
    process.start()

    logging.info('Python timer trigger function completed successfully.')


# Schedule StockAnalysisSpider to run every 3 months (January, April, July, September, December) at midnight
@scraped_stock.schedule(schedule="0 0 0 1 1,4,7,9,12 *", arg_name="myTimer2", run_on_startup=False)
def TimerTriggerStockAnalysisSpider(myTimer2: func.TimerRequest) -> None:
    if myTimer2.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function for StockAnalysisSpider started.')

    process = CrawlerProcess()
    process.crawl(StockAnalysisSpider)
    process.start()

    logging.info('Python timer trigger function for StockAnalysisSpider completed successfully.')