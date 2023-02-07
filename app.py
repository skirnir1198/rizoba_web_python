from flask import Flask, render_template # 追加

import dive
import scraping
import humanic
import goodman
import time

# app = Flask( __name__, static_folder="../",)
app = Flask(__name__,)


@app.route('/')
def index():
    # return 'Hello World'
    return render_template('index.html') # 変更


# ↓ /scrapingをGETメソッドで受け取った時の処理
@app.route('/scraping', methods=["POST"])
def get():
    results = scraping.scraping();
    # ↓　実行したいファイルの関数
    return render_template('search_result.html',dive_result=results[0],humanic_result=results[1],goodman_result=results[2],dive_num=dive.dive_num,humanic_num=humanic.humanic_num,goodman_num=goodman.goodman_num)
    # return render_template('search_result.html',dive_result=results[0],dive_num=dive.dive_num,humanic_num=humanic.humanic_num,)


# ↓ /scrapingをGETメソッドで受け取った時の処理
@app.route('/scraping_next', methods=["POST"])
def next():
    results = scraping.scraping_next()
    # ↓　実行したいファイルの関数
    return render_template('search_result.html',dive_result=results[0],humanic_result=results[1],goodman_result=results[2])
    # return render_template('search_result.html',dive_result=results[0])

if __name__ == "__main__":
    app.run(debug=True, threaded=True, host="0.0.0.0", port=3000)
    # app.run(host="0.0.0.0")
