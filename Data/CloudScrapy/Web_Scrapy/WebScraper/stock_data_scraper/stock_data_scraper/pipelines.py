# import os
# import pandas as pd
# from azure.storage.blob import BlobServiceClient

# class StockDataScraperPipeline:
#     def open_spider(self, spider):
#         # Initialize Azure Blob Storage client
#         connection_string = 'DefaultEndpointsProtocol=https;AccountName=stockfullquotesapi;AccountKey=HmVGx3RXJwRHNTk7ONCW1guuWty7cuXQXIvcNsDI9Viw8R2oGjsW1udji4NJGSef7buuHhUHWrAm+AStWIlGMw==;EndpointSuffix=core.windows.net'
#         self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
#         self.container_name = 'stockfullquotesapi'

#         # Ensure the container exists
#         self.container_client = self.blob_service_client.get_container_client(self.container_name)
#         if not self.container_client.exists():
#             self.container_client.create_container()
#             spider.logger.info(f'Created container: {self.container_name}')
#         else:
#             spider.logger.info(f'Container already exists: {self.container_name}')

#     def process_item(self, item, spider):
#         ticker = item['ticker']
#         file_path = f'Financial-Statement-{ticker}.md'
        
#         # Clean and format the data
#         df = self.clean_data(item['data'])
#         markdown_data = df.to_markdown(index=False)

#         # Combine markdown data into content
#         content = f"## {item['sheet_name']}\n{markdown_data}\n\n"
#         # Log the entire content
#         spider.logger.info(f'Prepared content for {ticker}: {content}')
        
#         self.upload_to_blob(file_path, content, spider)

#         return item

#     def clean_data(self, df):
#         # Attempt to convert all columns to numeric, except the first column
#         for col in df.columns[1:]:
#             df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', '').str.replace('%', '').str.strip(), errors='coerce')  # Clean and convert data
#         return df

#     def upload_to_blob(self, file_path, content, spider):
#         blob_client = self.container_client.get_blob_client(file_path)
        
#         try:
#             # Check if blob exists
#             existing_content = ""
#             if blob_client.exists():
#                 spider.logger.info(f'Blob {file_path} already exists. Downloading existing content.')
#                 existing_content = blob_client.download_blob().readall().decode('utf-8')

#             # Append the new content to existing content
#             combined_content = existing_content + content

#             # Upload the content to the blob
#             spider.logger.info(f'Uploading combined content to {file_path}')
#             blob_client.upload_blob(combined_content.encode('utf-8'), overwrite=True)
#             spider.logger.info(f'Successfully saved financial data to {file_path} in Blob Storage')
#         except Exception as e:
#             spider.logger.error(f"Failed to upload blob: {str(e)}")