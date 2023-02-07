# /Users/miyazakiari/Desktop/rizoba_app_web/public/py/test.py
# リゾバ.com
from flask import request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from time import sleep
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions

humanic_url = ''
humanic_num = ''
driver2 = ''


def scraping(area,period,occ,obb):
  global driver2
  chrome_path = "/Users/miyazakiari/Desktop/デスクトップ/開発/rizoba_app_web_python/chromedriver_mac64/chromedriver"
  options = Options()
  options.add_argument('--blink-settings=imagesEnabled=false')
  # options.add_argument('--headless') #バックエンド処理
  options.add_argument("--remote-debugging-port=9513")
  options.add_experimental_option('detach', True) #開いたままにする
  if driver2 == '':
    driver2 = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
  else:
    driver2.quit()
    driver2 == ''
    driver2 = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
  url = 'https://www.rizoba.com/jobsearch/'
  try:
    driver2.get(url)
    driver2.set_window_size('1200', '1000')
    searchBox = driver2.find_elements(By.CLASS_NAME, 'sfGroup__content')
    WebDriverWait(driver2, 20).until(expected_conditions.presence_of_all_elements_located)

    # エリア取得-----------
    if len(area) > 0:
      area = area.split(',')
      areas = searchBox[1].find_elements(By.CLASS_NAME,'selectButton__button')
      WebDriverWait(driver2, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'selectButton__button')))
      for item in area:
        if item == '4':
          driver2.execute_script('arguments[0].click();', areas[4])
          driver2.execute_script('arguments[0].click();', areas[5])
        elif item == '5':
          driver2.execute_script('arguments[0].click();', areas[6])
        elif item == '6':
          driver2.execute_script('arguments[0].click();', areas[8])
        elif item == '8':
          driver2.execute_script('arguments[0].click();', areas[9])
        else:
          driver2.execute_script('arguments[0].click();', areas[int(item)])

    # 期間取得-------------------
    if len(period) > 0:
      period = period.split(',')
      periods = searchBox[2].find_elements(By.CLASS_NAME, 'selectButton__button')
      for item in period:
        # 短期
        if item == '0':
          driver2.execute_script('arguments[0].click();', periods[0])
          driver2.execute_script('arguments[0].click();', periods[1])
          driver2.execute_script('arguments[0].click();', periods[2])
          driver2.execute_script('arguments[0].click();', periods[3])
        # 1ヶ月
        elif item == '1':
          driver2.execute_script('arguments[0].click();', periods[4])
        # 2,3ヶ月
        elif item == '2':
          driver2.execute_script('arguments[0].click();', periods[6])
        # 長期
        elif item == '3':
          driver2.execute_script('arguments[0].click();', periods[5])
          driver2.execute_script('arguments[0].click();', periods[7])
    # 職種取得
    if len(occ) > 0:
        occ = occ.split(',')
        occupation = searchBox[5].find_elements(By.CLASS_NAME,'selectButton__button')
        for item in occ:
          # 仲居
          if item == '0':
            driver2.execute_script('arguments[0].click();', occupation[0])
            # occupation[0].click()
          # レストラン・飲食店
          elif item == '1':
            driver2.execute_script('arguments[0].click();', occupation[1])
          # フロントベル・ナイトフロント・受付
          elif item == '2':
            driver2.execute_script('arguments[0].click();', occupation[2])
          # 事務・宿泊予約・内務
          elif item == '3':
            driver2.execute_script('arguments[0].click();', occupation[3])
          # 販売・売店
          elif item == '4':
            driver2.execute_script('arguments[0].click();', occupation[4])
          # 調理・調理補助
          elif item == '5':
            driver2.execute_script('arguments[0].click();', occupation[5])
            driver2.execute_script('arguments[0].click();', occupation[6])
          # 裏方
          elif item == '6':
            driver2.execute_script('arguments[0].click();', occupation[7])
          # 宿泊業務全般
          elif item == '7':
            driver2.execute_script('arguments[0].click();', occupation[8])
          # その他業務
          elif item == '8':
            driver2.execute_script('arguments[0].click();', occupation[9])
          # プール・マリン
          elif item == '9':
            driver2.execute_script('arguments[0].click();', occupation[20])
          # レジャー・アクティビティ・テーマパーク
          elif item == '20':
            driver2.execute_script('arguments[0].click();', occupation[11])
            driver2.execute_script('arguments[0].click();', occupation[12])
            driver2.execute_script('arguments[0].click();', occupation[13])
          # スキー場
          elif item == '11':
            for item in range(14,21):
              driver2.execute_script('arguments[0].click();', occupation[item])
        
    # こだわり取得
    if len(obb) > 0:
        obb = obb.split(',')
        obsession = searchBox[4].find_elements(By.CLASS_NAME,'search-select-label')
        WebDriverWait(driver2, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'search-select-label')))
        for item in obb:
          # 個室料
          if item == '0':
            driver2.execute_script('arguments[0].click();', obsession[4])
          # 高時給
          elif item == '1':
            driver2.execute_script('arguments[0].click();', obsession[0]) #2000円以上
          # Wifiあり
          elif item == '2':
            driver2.execute_script('arguments[0].click();', obsession[3])
          # 食事条件良い
          elif item == '3':
            driver2.execute_script('arguments[0].click();', obsession[13])
          # 通し勤務
          elif item == '4':
            driver2.execute_script('arguments[0].click();', obsession[16])
          # 周辺・生活便利
          elif item == '5':
            driver2.execute_script('arguments[0].click();', obsession[15])
          # 出会いが多い
          elif item == '6':
            driver2.execute_script('arguments[0].click();', obsession[21])
          # 温泉利用可能
          elif item == '7':
            driver2.execute_script('arguments[0].click();', obsession[7])
          # 外国語が活かせる
          elif item == '8':
            driver2.execute_script('arguments[0].click();', obsession[22])
          
  # 検索操作
    global humanic_url
    WebDriverWait(driver2, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'searchForm__submit')))
    btn = driver2.find_element(By.CLASS_NAME,'searchForm__submit')
    driver2.execute_script('arguments[0].click();', btn)

  # 検索後ページ
    searchResult = ''
    humanic_url = driver2.current_url
    driver2.get(humanic_url)
    WebDriverWait(driver2, 20).until(expected_conditions.presence_of_all_elements_located)
    resultsBox = driver2.find_element(By.CLASS_NAME,'list-items')
    items = resultsBox.find_elements(By.CLASS_NAME,'search-element')
    for item in items:
      searchResult += 'ヒューマニック,'
      link = item.find_element(By.TAG_NAME,'a').get_attribute('href')
      searchResult += link + ','
      texts = item.find_elements(By.CLASS_NAME,'text')
      for i in texts:
        searchResult += i.text + ','
      searchResult += 'xxx'
    global humanic_num
    humanic_num = driver2.find_element(By.ID,'js-result-total').text
    return searchResult[:-4]
  except Exception as e:
    driver2.quit()
    driver2 = ''
    return searchResult[:-4]

def humanic_next():
  try:
    global driver2
    searchResult = ''
    WebDriverWait(driver2, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'pagination-link-next')))
    next = driver2.find_element(By.CLASS_NAME,'pagination-link-next')
    driver2.execute_script('arguments[0].click();', next)
    WebDriverWait(driver2, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'list-items')))
    resultsBox = driver2.find_element(By.CLASS_NAME,'list-items')
    items = resultsBox.find_elements(By.CLASS_NAME,'search-element')
    for item in items:
      searchResult += 'ヒューマニック,'
      link = item.find_element(By.TAG_NAME,'a').get_attribute('href')
      searchResult += link + ','
      texts = item.find_elements(By.CLASS_NAME,'text')
      for i in texts:
        searchResult += i.text + ','
      searchResult += 'xxx'
    return searchResult[:-4]
  except Exception as e:
    driver2.quit()
    driver2 = ''
    return searchResult[:-4]