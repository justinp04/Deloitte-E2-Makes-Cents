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
        file_path = os.path.join('raw_data', f'financial_statements_{ticker}.xlsx')

        # Check if file exists, and write accordingly
        if os.path.exists(file_path):
            writer = pd.ExcelWriter(file_path, engine='openpyxl', mode='a')
        else:
            writer = pd.ExcelWriter(file_path, engine='xlsxwriter')

        df = item['data']
        df = self.clean_data(df)  # Clean the data before saving
        df.to_excel(writer, sheet_name=item['sheet_name'], index=False)  # Write data to the appropriate sheet
        writer._save()
        writer.close()

        return item

    def clean_data(self, df):
        # Attempt to convert all columns to numeric, except the first column
        for col in df.columns[1:]:
            df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', '').str.replace('%', '').str.strip(), errors='coerce')  # Clean and convert data
        return df
