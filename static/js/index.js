
{
  var uid;
  var img;
  var post_img;
  var userName;

  const area = [
    '北海道',
    '東北',
    '甲信越',
    '関東',
    '東海・北陸',
    '関西',
    '九州',
    '中国・四国',
    '沖縄',
  ]
  
  const period = [
    '短期',
    '1ヶ月',
    '2,3ヶ月',
    '長期(3ヶ月以上)',
  ]
  
  const obsession = [
    '個室寮','高時給(1100以上)','Wi-Fiあり','食事条件良い','通し勤務',
    '周辺便利・生活便利(コンビニ・スーパー)','出会いが多い・仲間が多い','温泉利用可能','外国語が活かせる',
  ]

  const occupation = [
    '仲居','レストラン・飲食店','フロントベル・ナイトフロント・受付','事務・宿泊予約・内務','販売・売店','調理・調理補助','裏方','宿泊業務全般','その他業務',
    'プール・マリン','レジャー・アクティビティ・テーマパーク・ゴルフ場・アウトドア','スキー場',
  ]
  
  var selectArea = [];
  var selectPeriod = [];
  var selectOccupation = [];
  var selectObsession = [];
  var dive_num;
  var goodman_num;
  var humanic_num;

  $(document).ready(
    async function(){
      getSearchpage();
    $('#search_btn').on('click', async function () {
      if(!$('#search_btn').hasClass('select_marker')) {
        $('#work_btn').removeClass('select_marker');
        $('#company_btn').removeClass('select_marker');
        $('#search_btn').toggleClass('select_marker');
        await fadeIn();
        await getSearchpage();
        fadeOut();
      }
    });

    // 検索ページ表示
   function getSearchpage() {
    $("#postList").empty();

    // エリアボタン作成
    var areaBox = '<div id="area" class="select_btn">'
    for(var i=0; i<area.length; i++) {
      areaBox += `<div class="searchItem" data-count="${i}">${area[i]}</div>`;
    }
    areaBox += '</div>';

    // 期間ボタン作成
    var periodBox = '<div id="period" class="select_btn">'
    for(var i=0; i<period.length; i++) {
      periodBox += `<div class="searchItem" data-count="${i}">${period[i]}</div>`;
    }
    periodBox += '</div>';

    // 職種ボタン作成
    var occupationBox = '<div id="occupation" class="select_btn">'
    for(var i=0; i<occupation.length; i++) {
      occupationBox += `<div class="searchItem" data-count="${i}">${occupation[i]}</div>`;
    }
    occupationBox += '</div>';

    // こだわりボタン作成
    var obsessionBox = '<div id="obsession" class="select_btn">'
    for(var i=0; i<obsession.length; i++) {
    obsessionBox += `<div class="searchItem" data-count="${i}">${obsession[i]}</div>`;
    }
    obsessionBox += '</div>';

    $("#postList").append(areaBox);
    $("#postList").append(periodBox);
    $("#postList").append(occupationBox);
    $("#postList").append(obsessionBox);

    // 検索ボタン
      $("#postList").append(`<form method="POST" action="/scraping">
        <input id="area_list" name="area_list" type="hidden" class="form-control" value="">
        <input id="period_list" name="period_list" type="hidden" class="form-control" value="">
        <input id="occupation_list" name="occupation_list" type="hidden" class="form-control" value="">
        <input id="obsession_list" name="obsession_list" type="hidden" class="form-control" value="">
        <button type="submit" id="submit">検索</button>
      </form>`); 
      fadeOut();

    }
  });


  // 期間選択
  $(document).on('click', '#period > .searchItem', function(){
    const num = $(this).data('count');
    if(selectPeriod.includes(num)) {
      selectPeriod = jQuery.grep(selectPeriod, function(value) {
        return value != num;
      });
      $(this).removeClass('select');

    } else {
      selectPeriod.push($(this).data('count'));
      $(this).addClass('select');
    }
  });

  // エリア選択
  $(document).on('click', '#area > .searchItem', function(){
    const num = $(this).data('count');
    if(selectArea.includes(num)) {
      selectArea = jQuery.grep(selectArea, function(value) {
        return value != num;
      });
      $(this).removeClass('select');

    } else {
      selectArea.push($(this).data('count'));
      $(this).addClass('select');
    }
  });

  // 時給選択
  $(document).on('click', '#houlyWage > .searchItem', function(){
    $('#houlyWage > .select').removeClass('select');
    const num = $(this).data('count');
    if(selectHourlyWage.includes(num)) {
      selectHourlyWage = jQuery.grep(selectHourlyWage, function(value) {
        return value != num;
      });
      $(this).removeClass('select');

    } else {
      selectHourlyWage.push($(this).data('count'));
      $(this).addClass('select');
    }
  });

  // 職種1選択
  $(document).on('click', '#occupation > .searchItem', function(){
    const num = $(this).data('count');
    if(selectOccupation.includes(num)) {
      selectOccupation = jQuery.grep(selectOccupation, function(value) {
        return value != num;
      });
      $(this).removeClass('select');
    } else {
      selectOccupation.push($(this).data('count'));
      $(this).addClass('select');
    }
  });

  // こだわり選択
  $(document).on('click', '#obsession > .searchItem', function(){
    const num = $(this).data('count');
    if(selectObsession.includes(num)) {
      selectObsession = jQuery.grep(selectObsession, function(value) {
        return value != num;
      });
      $(this).removeClass('select');
    } else {
      selectObsession.push($(this).data('count'));
      $(this).addClass('select');
    }
  });

  // 検索ボタン
  $(document).on('click', '#submit', function(){
    fadeIn();
    // エリア
    $("#area_list").val(selectArea);
    // 期間
    $("#period_list").val(selectPeriod);
    // 職種
    $("#occupation_list").val(selectOccupation);
    // こだわり
    $("#obsession_list").val(selectObsession);
  });
  
  // 投稿コメント文字数調整
  function omittedContent(string) {
    // 定数で宣言
    const MAX_LENGTH = 70;
  
    // もしstringの文字数がMAX_LENGTH（今回は10）より大きかったら末尾に...を付け足して返す。
    if (string.length > MAX_LENGTH) {
  
      // substr(何文字目からスタートするか, 最大値);
      return string.substr(0, MAX_LENGTH) + '...';
    }
    //　文字数がオーバーしていなければそのまま返す
    return string;
  }
  
  $(document).on('click', '.profile', function(){
    window.location.href = `profile.html?uid=${uid}`;
  });

  function workDetail(docId, uid) {
    window.location.href = `work_detail.html?docId=${docId}&uid=${uid}`;
  }

  function companyDetail(docId, uid) {
    window.location.href = `company_detail.html?docId=${docId}&uid=${uid}`;
  }
  

  // ローカルストレージ削除
  var num = localStorage.getItem("num");
  var minus = localStorage.getItem("minus");
  var humanic_list = localStorage.getItem("humanic_list");
  var all_item = localStorage.getItem("all_item");


  if ( num ){
    localStorage.removeItem("num"); 
  }
  if ( minus ){
    localStorage.removeItem("minus"); 
  }

  if ( humanic_list ){
    localStorage.removeItem("humanic_list"); 
  }
  if ( all_item ){
    localStorage.removeItem("all_item"); 
  }

  //ローディング画面の表示
  function fadeOut() {
    $("#loading").fadeOut('slow');//ローディング画面を1.5秒（1500ms）待機してからフェードアウト
    $("#loading_box").fadeOut('slow');//ローディング画像を1.2秒（1200ms）待機してからフェードアウト
  };

  function fadeIn() {
    $("#loading").fadeIn();
    $("#loading_box").fadeIn();
  };

}