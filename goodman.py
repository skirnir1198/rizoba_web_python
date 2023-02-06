# /Users/miyazakiari/Desktop/rizoba_app_web/public/py/test.py

from flask import request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from time import sleep
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions

goodman_url = ''
goodman_num = ''
driver3 = ''

def scraping(area,period,occ,obb):
  global driver3
  chrome_path = "/Users/miyazakiari/Desktop/開発/chromedriver"
  options = Options()
  options.add_argument('--headless') #バックエンド処理
  options.add_argument("--remote-debugging-port=9514")
  options.add_argument('--blink-settings=imagesEnabled=false')
  options.add_experimental_option('detach', True) #開いたままにする
  if driver3 == '':
    driver3 = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
  else:
    driver3.quit()
    driver3 == ''
    driver3 = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
  url = 'https://www.resortbaito.com/search/'
  try:
    driver3.get(url)
    WebDriverWait(driver3, 20).until(expected_conditions.presence_of_all_elements_located)
    WebDriverWait(driver3, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'more-kodawari')))
    driver3.set_window_size('1200', '1000')
    more = driver3.find_element(By.CLASS_NAME,'more-kodawari')
    more.click()
    driver3.execute_script("window.scrollTo(0, 0)") #ページトップへ移動
    WebDriverWait(driver3, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'input-chk-list')))
    searchBox = driver3.find_elements(By.CLASS_NAME,'input-chk-list')
    WebDriverWait(driver3, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'input-chk-list-icon')))
    kodawari = driver3.find_element(By.CLASS_NAME,'input-chk-list-icon')

    # エリア取得-----------
    if len(area) > 0:
      area = area.split(',')
      WebDriverWait(driver3, 20).until(expected_conditions.element_to_be_clickable((By.TAG_NAME, 'li')))
      areas = searchBox[0].find_elements(By.TAG_NAME,'li')
      for item in area:
        if item == '2':
          areas[4].click()
        elif item == '3':
          areas[2].click()
        elif item == '4':
          areas[3].click()
          areas[5].click()
        elif item == '5':
          areas[6].click()
        elif item == '6':
          areas[9].click()
        elif item == '7':
          areas[7].click()
          areas[8].click()
        elif item == '8':
          areas[10].click()
        else:
          areas[int(item)].click()

    # 期間取得-------------------
    if len(period) > 0:
      period = period.split(',')
      WebDriverWait(driver3, 20).until(expected_conditions.element_to_be_clickable((By.TAG_NAME, 'li')))
      periods = searchBox[1].find_elements(By.TAG_NAME,'li')
      for item in period:
        # 短期
        if item == '0':
          periods[0].click()
          periods[1].click()
          periods[2].click()
        # 1ヶ月
        elif item == '1':
          periods[3].click()
        # 2,3ヶ月
        elif item == '2':
          periods[4].click()
        # 長期
        elif item == '3':
            periods[5].click()

    # 職種取得
    if len(occ) > 0:
        occ = occ.split(',')
        WebDriverWait(driver3, 20).until(expected_conditions.element_to_be_clickable((By.TAG_NAME, 'li')))
        occupation = searchBox[4].find_elements(By.TAG_NAME,'li')
        occupation2 = searchBox[5].find_elements(By.TAG_NAME,'li')
        for item in occ:
          # 仲居
          if item == '0':
            occupation[8].click()
          # レストラン・飲食店
          elif item == '1':
            occupation[0].click()
          # フロントベル・ナイトフロント・受付
          elif item == '2':
            occupation[6].click()
            occupation[15].click()
          # 事務・宿泊予約・内務
          elif item == '3':
            occupation[5].click()
          # 販売・売店
          elif item == '4':
            occupation[7].click()
          # 調理・調理補助
          elif item == '5':
            occupation[10].click()
            occupation[11].click()
            occupation[13].click()
          # 裏方
          elif item == '6':
            occupation[9].click()
          # 宿泊業務全般
          elif item == '7':
            occupation[12].click()
          # その他業務
          # elif item == '8':
          #   driver3.execute_script('arguments[0].click();', occupation[9])
          # プール・マリン
          # elif item == '9':
          #   driver3.execute_script('arguments[0].click();', occupation[10])
          # レジャー・アクティビティ・テーマパーク
          elif item == '10':
            occupation[14].click()
          # スキー場
          elif item == '11':
            occupation2[0].click()
            occupation2[1].click()
            occupation2[2].click()

    # こだわり取得
    if len(obb) > 0:
        obb = obb.split(',')
        WebDriverWait(driver3, 20).until(expected_conditions.element_to_be_clickable((By.TAG_NAME, 'li')))
        obsession = kodawari.find_elements(By.TAG_NAME,'li')
        obsession2 = searchBox[6].find_elements(By.TAG_NAME,'li')
        for item in obb:
          # 個室料
          if item == '0':
            obsession[2].click()
          # 高時給
          elif item == '1':
            obsession[0].click() #1100円以上
            obsession[1].click() #1200円以上
            obsession2[0].click() #1300円以上
          # Wifiあり
          elif item == '2':
            obsession[12].click()
          # 食事条件良い
          elif item == '3':
            obsession[3].click()
          # 通し勤務
          elif item == '4':
            obsession2[22].click()
          # 周辺・生活便利
          elif item == '5':
            obsession[14].click()
            obsession[15].click()
          # 出会いが多い
          elif item == '6':
            obsession[13].click()
          # 温泉利用可能
          elif item == '7':
            obsession[10].click()
          # 外国語が活かせる
          elif item == '8':
            obsession2[12].click()

  # 検索操作
    global goodman_url
    WebDriverWait(driver3, 20).until(expected_conditions.element_to_be_clickable((By.ID,'submit')))
    btn = driver3.find_element(By.ID,'submit')
    btn.click()
    goodman_url = driver3.current_url
    driver3.get(goodman_url)
    WebDriverWait(driver3, 20).until(expected_conditions.element_to_be_clickable((By.CLASS_NAME, 'list-baito')))
    driver3.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    global goodman_num
    goodman_num = driver3.find_element(By.CLASS_NAME,'ttl-main').text
    goodman_num = goodman_num.split('：')[1].replace('件','')
    resultsBox = driver3.find_element(By.CLASS_NAME,'list-baito')
    li = resultsBox.find_elements(By.TAG_NAME,'li')
    searchResult = ''
    for item in li:
      searchResult += 'グッドマンサービス!'
      link = item.find_element(By.TAG_NAME,'a').get_attribute('href')
      div = item.find_element(By.TAG_NAME,'div')
      text = div.find_element(By.CLASS_NAME,'head')
      texts = div.find_elements(By.CLASS_NAME,'txt')
      if len(texts) >= 2:
        searchResult += link + '!'  + text.text + '!' + texts[0].text + '!' + texts[1].text + '!'
      else:
        searchResult += link + '!'  + text.text + '!' + texts[0].text + '!' 
      searchResult += 'xxx'
    return searchResult[:-4]
  except Exception as e:
    driver3.quit()
    driver3 = ''
    return searchResult[:-4]

def goodman_next():
  try:
    global driver3
    driver3.implicitly_wait(1)
    driver3.minimize_window()
    driver3.maximize_window()
    resultsBox = driver3.find_element(By.CLASS_NAME,'list-baito')
    li = resultsBox.find_elements(By.TAG_NAME,'li')
    searchResult = ''
    for item in li:
      searchResult += 'グッドマンサービス!'
      link = item.find_element(By.TAG_NAME,'a').get_attribute('href')
      div = item.find_element(By.TAG_NAME,'div')
      text = div.find_element(By.CLASS_NAME,'head')
      texts = div.find_elements(By.CLASS_NAME,'txt')
      if len(texts) >= 2:
        searchResult += link + '!'  + text.text + '!' + texts[0].text + '!' + texts[1].text + '!'
      else:
        searchResult += link + '!'  + text.text + '!' + texts[0].text + '!'
      searchResult += 'xxx'
    return searchResult[:-4]
  except Exception as e:
    driver3.quit()
    driver3 = ''
    return searchResult[:-4]