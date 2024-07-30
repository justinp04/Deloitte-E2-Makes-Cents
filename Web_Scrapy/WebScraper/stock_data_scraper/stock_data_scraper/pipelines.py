# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import os
import pandas as pd
# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class StockDataScraperPipeline:
    def open_spider(self, spider):
        if not os.path.exists('raw_data'):
            os.makedirs('raw_data')

    def process_item(self, item, spider):
        ticker = item['ticker']
        file_path = os.path.join('raw_data', f'financial_statements_{ticker}.md')

        df = item['data']
        df = self.clean_data(df)  # Clean the data before saving

        with open(file_path, 'a') as f:
            f.write(f"## {item['sheet_name']}\n")
            f.write(df.to_markdown(index=False))
            f.write("\n\n")

        return item

    def clean_data(self, df):
        # Attempt to convert all columns to numeric, except the first column
        for col in df.columns[1:]:
            df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', '').str.replace('%', '').str.strip(), errors='coerce')  # Clean and convert data
        return df