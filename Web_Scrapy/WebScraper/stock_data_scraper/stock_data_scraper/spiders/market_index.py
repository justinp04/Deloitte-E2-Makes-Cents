# import time
#
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.support.select import Select
#
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# import csv
#
# service = Service()
# options = webdriver.ChromeOptions()
# options.add_argument("--headless=new")
#
#
#
# from selenium import webdriver
# url = "https://www.marketindex.com.au/all-ordinaries"
# options = webdriver.ChromeOptions()
# options.add_argument("--disable-blink-features=AutomationControlled")
# driver = webdriver.Chrome(options=options)
# driver.get(url)
#
#
# # wait for the product grid to load
# time.sleep(5)
# WebDriverWait(driver, 10).until(
#     EC.presence_of_all_elements_located((By.CSS_SELECTOR, "table.mi-table.mb-4.quoteapi-even-items"))
# )
# show_all_button = driver.find_element(By.CSS_SELECTOR, 'button.btn.control-company-display')
# show_all_button.click()
# # Locate the table
# time.sleep(5)
# table = driver.find_element(By.CSS_SELECTOR, 'table.mi-table.mb-4.quoteapi-even-items')
#
# # Locate all rows within the table body
# rows = table.find_elements(By.CSS_SELECTOR, 'tbody tr')
#
# # Extract the links from the "code" column
# links = []
# for row in rows:
#     try:
#         code_column = row.find_element(By.CSS_SELECTOR, 'td.hidden.sm\\:table-cell a')
#         link = code_column.get_attribute('href')
#         driver.get(link)
#
#         # Wait for the dropdown to be available
#         dropdown = WebDriverWait(driver, 10).until(
#             EC.presence_of_element_located((By.NAME, 'type'))
#         )
#         select = Select(dropdown)
#         select.select_by_visible_text('Annual Reports')
#
#         WebDriverWait(driver, 10).until(
#             EC.presence_of_element_located((By.CSS_SELECTOR, "a.announcement-pdf-link"))
#         )
#         pdf_link_element = driver.find_element(By.CSS_SELECTOR, 'a.announcement-pdf-link')
#         pdf_link = pdf_link_element.get_attribute('href')
#         links.append(pdf_link)
#     except Exception as e:
#         print(f"Error processing row: {e}")
#
# # Write links to a CSV file
# with open("pdf_links.csv", "w", newline='', encoding='utf-8') as file:
#     writer = csv.writer(file)
#     writer.writerow(["PDF Links"])
#     for link in links:
#         writer.writerow([link])
#
# print("CSV file written successfully.")
#
# # close the driver
# driver.quit()