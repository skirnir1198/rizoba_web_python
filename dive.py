from flask import request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from time import sleep
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
import math


dive_url = ''
content_num = 20
dive_num = ''
driver = ''

def scraping(area,period,occ,obb):
  global driver
  chrome_path = "/Users/miyazakiari/Desktop/デスクトップ/開発/rizoba_app_web_python/chromedriver_mac64/chromedriver"
  options = Options()
  options.add_argument('--headless') #バックエンド処理
  options.add_argument("--remote-debugging-port=9515")
  options.add_argument('--blink-settings=imagesEnabled=false')
  options.add_experimental_option('detach', True) #開いたままにする
  if driver == '':
    driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
  else:
    driver.quit()
    driver == ''
    driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
  url = 'https://resortbaito-dive.com/works/search'
  try:
    driver.get(url)
    driver.set_window_size('1200', '1000')
    WebDriverWait(driver, 20).until(expected_conditions.presence_of_all_elements_located)
    searchBox = driver.find_elements(By.CLASS_NAME, "condition-list")
    # エリア取得-----------
    if len(area) > 0:
      area_list = area.split(',')
      areas = driver.find_elements(By.CLASS_NAME, "area-text")
      areas[0].click()
      areas[0].click()
      sleep(1)
      WebDriverWait(driver, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'area-text')))
      for item in area_list:
        areas[int(item)].click()

    # 期間取得-------------------
    if len(period) > 0:
      period = period.split(',')
      WebDriverWait(driver, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'condition-item')))
      periods = searchBox[0].find_elements(By.CLASS_NAME,'condition-item')
      for item in period:
        # 短期
        if item == '0':
          periods[3].click()
          periods[4].click()
        # 1ヶ月
        elif item == '1':
          periods[0].click()
        # 2,3ヶ月
        elif item == '2':
          periods[1].click()
        # 長期
        elif item == '3':
          periods[2].click()

    # 職種取得
    if len(occ) > 0:
      occ = occ.split(',')
      WebDriverWait(driver, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'condition-item')))
      occupation1 = searchBox[2].find_elements(By.CLASS_NAME,'condition-item')
      occupation2 = searchBox[3].find_elements(By.CLASS_NAME,'condition-item')
      occupation3 = searchBox[4].find_elements(By.CLASS_NAME,'condition-item')
      for item in occ:
        # 仲居
        if item == '0':
          occupation1[6].click()
          occupation1[7].click()
        # レストラン・飲食店
        elif item == '1':
          occupation1[0].click()
          occupation1[1].click()
          occupation1[3].click()
        # フロントベル・ナイトフロント・受付
        elif item == '2':
          occupation1[4].click()
        # 事務・宿泊予約・内務
        elif item == '3':
          occupation1[11].click()
        # 販売・売店
        elif item == '4':
          occupation1[5].click()
        # 調理・調理補助
        elif item == '5':
          occupation1[9].click()
        # 裏方
        elif item == '6':
          occupation1[10].click()
        # 宿泊業務全般
        elif item == '7':
          occupation1[8].click()
        # その他業務
        elif item == '8':
          occupation2[7].click()
        # プール・マリン
        elif item == '9':
          occupation2[3].click()
          occupation2[4].click()
        # レジャー・アクティビティ・テーマパーク
        elif item == '10':
          occupation2[2].click()
        # スキー場
        elif item == '11':
          for item in range(10):
            occupation3[item].click()
    # こだわり取得
    if len(obb) > 0:
        obb = obb.split(',')
        WebDriverWait(driver, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'condition-item')))
        obsession1 = searchBox[5].find_elements(By.CLASS_NAME,'condition-item')
        obsession2 = searchBox[6].find_elements(By.CLASS_NAME,'condition-item')
        obsession3 = searchBox[7].find_elements(By.CLASS_NAME,'condition-item')
        obsession4 = searchBox[8].find_elements(By.CLASS_NAME,'condition-item')
        obsession5 = searchBox[9].find_elements(By.CLASS_NAME,'condition-item')
        obsession6 = searchBox[10].find_elements(By.CLASS_NAME,'condition-item')
        obsession7 = searchBox[11].find_elements(By.CLASS_NAME,'condition-item')
        obsession8 = searchBox[12].find_elements(By.CLASS_NAME,'condition-item')
        for item in obb:
          # 個室料
          if item == '0':
            obsession1[0].click()
          # 高時給
          # elif item == '1':
          #   obsession1[0].click()
          # Wifiあり
          elif item == '2':
            obsession6[7].click()
          # 食事条件良い
          elif item == '3':
            obsession6[6].click()
          # 通し勤務
          elif item == '4':
            obsession5[2].click()
          # 周辺・生活便利
          elif item == '5':
            obsession8[0].click()
          # 出会いが多い
          elif item == '6':
            obsession7[1].click()
          # 温泉利用可能
          elif item == '7':
            obsession3[0].click()
          # 外国語が活かせる
          elif item == '8':
            obsession2[1].click()
            obsession2[2].click()
            obsession2[3].click()
    sleep(1)
    num = driver.find_element(By.CLASS_NAME,'total-job').text
    global dive_num
    dive_num = num
  # 検索操作
    WebDriverWait(driver, 20).until(expected_conditions.element_to_be_clickable((By.TAG_NAME,'button')))
    btn = driver.find_elements(By.TAG_NAME,'button')[1]
    btn.click()
    dive_url = driver.current_url
    driver.get(dive_url)
    WebDriverWait(driver, 20).until(expected_conditions.presence_of_all_elements_located)
    # WebDriverWait(driver, 60).until(expected_conditions.presence_of_element_located((By.CLASS_NAME, 'num-info')))
    # num = driver.find_element(By.CLASS_NAME,'num-info').text
    # global dive_num
    # dive_num = num
    resultsBox = driver.find_elements(By.CLASS_NAME,'job-item-style')
    searchResult = ''
    for item in resultsBox:
      searchResult += 'Dive,'
      link = item.find_element(By.TAG_NAME,'a').get_attribute('href')
      searchResult += link + ','
      ans = item.find_elements(By.CLASS_NAME,'recruitment-text')
      for a in ans:
        searchResult += a.text + ','
      searchResult += 'xxx'
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    return searchResult[:-4]
  except Exception as e:
    driver.quit()
    driver = ''
    return searchResult[:-4]


def dive_next():
  try:
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    driver.implicitly_wait(1)
    driver.minimize_window()
    driver.maximize_window()
    WebDriverWait(driver, 20).until(expected_conditions.presence_of_all_elements_located)
    resultsBox = driver.find_elements(By.CLASS_NAME,'job-item-style')
    searchResult = ''
    for item in resultsBox:
      searchResult += 'Dive,'
      link = item.find_element(By.TAG_NAME,'a').get_attribute('href')
      searchResult += link + ','
      ans = item.find_elements(By.CLASS_NAME,'recruitment-text')
      for a in ans:
        searchResult += a.text + ','
      searchResult += 'xxx'
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    return searchResult[:-4]
  except Exception as e:
    driver.quit()
    return searchResult[:-4]
