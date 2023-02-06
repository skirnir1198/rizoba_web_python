from flask import request
from concurrent.futures import ThreadPoolExecutor
import dive
import humanic
import goodman
from time import sleep

def scraping():
  results = []
  area_list = request.form['area_list']
  period_list = request.form['period_list']
  occupation_list = request.form['occupation_list']
  obsession_list = request.form['obsession_list']
  pool = ThreadPoolExecutor(max_workers=3, thread_name_prefix="thread")
  dive_ans = pool.submit(dive.scraping,area_list,period_list,occupation_list,obsession_list)
  humanic_ans = pool.submit(humanic.scraping,area_list,period_list,occupation_list,obsession_list)
  goodman_ans = pool.submit(goodman.scraping,area_list,period_list,occupation_list,obsession_list)
  results.append(dive_ans.result())
  results.append(humanic_ans.result())
  results.append(goodman_ans.result())
  return results

def scraping_next():
  results = []
  pool = ThreadPoolExecutor(max_workers=3, thread_name_prefix="thread")
  dive_ans = pool.submit(dive.dive_next)
  humanic_ans = pool.submit(humanic.humanic_next)
  goodman_ans = pool.submit(goodman.goodman_next)
  results.append(dive_ans.result())
  results.append(humanic_ans.result())
  results.append(goodman_ans.result())
  return results
