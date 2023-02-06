# /Users/miyazakiari/Desktop/rizoba_app_web/public/py/test.py

from flask import request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from time import sleep
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import math


dive_url = ''
content_num = 20

def dive_next():
  
  chrome_path = "/Users/miyazakiari/Desktop/開発/chromedriver"
  options = Options()
  # options.add_argument('--headless') #バックエンド処理
  options.add_argument("--remote-debugging-port=9515")
  options.add_argument('--incognito')
  options.add_experimental_option('detach', True) #開いたままにする
  driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
  try:
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, 'job-item-style')))
    num = driver.find_element(By.CLASS_NAME,'num-info')

    resultsBox = driver.find_elements(By.CLASS_NAME,'job-item-style')
    searchResult = ''
    for item in resultsBox:
      searchResult += 'Dive,'
      try:
        link = item.find_element(By.TAG_NAME,'a').get_attribute('href')
        searchResult += link + ','
        ans = item.find_elements(By.CLASS_NAME,'recruitment-text')
      except:
        sleep(1)
        link = item.find_element(By.TAG_NAME,'a').get_attribute('href')
        searchResult += link + ','
        ans = item.find_elements(By.CLASS_NAME,'recruitment-text')
      for a in ans:
        try:
          searchResult += a.text + ','
        except:
          sleep(1)
          searchResult += a.text + ','
      searchResult += 'xxx'
    driver.quit()
    return searchResult[:-4]
  except Exception as e:
    driver.quit()
    return searchResult[:-4]
