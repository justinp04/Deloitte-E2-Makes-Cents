import logging

import azure.functions as func

import pandas as pd
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
import tempfile
import os

import io
from Web_Scrapy.WebScraper.stock_data_scraper.stock_data_scraper.spiders.stock_analysis import StockSpider as StockAnalysis

def main(myblob: func.InputStream, outputBlob: func.Out[bytes]):
    logging.info(f"Python blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")

    # Scrape stock data using StockAnalysis spider
    output_data = run_scrapy_spider()

    # Write the output to the output blob
    outputBlob.set(output_data.encode('utf-8'))


def run_scrapy_spider():
    # Create a temporary directory to store the scraped data
    with tempfile.TemporaryDirectory() as tempdir:
        process = CrawlerProcess(get_project_settings())
        process.crawl(StockAnalysis, output_dir=tempdir)
        process.start()

        # Read the scraped data from the temporary directory
        data = ""
        for root, dirs, files in os.walk(tempdir):
            for file in files:
                if file.endswith(".md"):
                    with open(os.path.join(root, file), 'r') as f:
                        data += f.read()

    return data
