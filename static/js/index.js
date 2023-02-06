
{
  var uid;
  var img;
  var post_img;
  var userName;

  $(document).ready(
    async function(){
    var div2;
    const db = firebase.firestore();
    const data = await db.collection('config').doc('5flwSgo6T0Bd7M9vV7ho').get();
      db.collection('config').doc('5flwSgo6T0Bd7M9vV7ho').update({
        'web_view': data.get('web_view')+1,
    });
    // $.ajaxSetup({cache:false});
    // $("#header").load("../header.html");
    // $.ajaxSetup({cache:false});
    // $("#footer").load("../footer.html");

    // アルバム存在確認 ------------------------------------------------------------
    // const item = await db.collection("user").get();
    // item.forEach((data) => {
    //   db.collection("user").doc(data.get('uid')).collection('album').get().then((data)=> {
    //     data.forEach((postDoc) => {
    //       console.log(postDoc.data());
    //     })
    //   });
    // });

    // 文字数制限関数
    function omittedContent(string) {
      // 定数で宣言
      const MAX_LENGTH = 100;
    
      // もしstringの文字数がMAX_LENGTH（今回は10）より大きかったら末尾に...を付け足して返す。
      if (string.length > MAX_LENGTH) {
    
        // substr(何文字目からスタートするか, 最大値);
        return string.substr(0, MAX_LENGTH) + '...';
      }
      //　文字数がオーバーしていなければそのまま返す
      return string;
    }
    
    // ログイン状態確認後表示変更
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        sessionStorage.setItem('uid', user.uid);
        // ログイン状態
        uid = user.uid;
        // ログイン状態永続化
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
        db.collection("user").doc(uid).get().then((doc)=>{
          if(doc.get('profile') != '') {
            img = doc.get('profile');
          } else {
            img = '../static/image/noImage.png';
          }
          userName = doc.get('userName');
          $("#post").empty();
          if (window.matchMedia( "(max-width: 768px)" ).matches) {
            div2 = $(`<a class="post_work post_btn"><i id="post_icon" class="fa-solid fa-pen fa-2xs"></i>体験談</a>`);
          } else {
            div2 = $(`<a class="post_work post_btn"><i id="post_icon" class="fa-solid fa-pen fa-lg"></i>体験談を書く</a>`);
          }
          $("#post").append(div2); 
        });
        } else {
          sessionStorage.setItem('uid', '');
          // ログインしていない状態
        }
      getWorkPost();
      fadeOut();
    });

    // 体験談投稿ページへ遷移
    $(document).on('click',".post_work", function () {
      window.location.href = `work_add.html?uid=${uid}`;
    });

    // 派遣会社レビュー投稿ページへ遷移
    $(document).on('click',".post_company", function () {
      window.location.href = `company_add.html?uid=${uid}`;
    });

    // メニューリスト表示
    $(document).on('click',".menu-btn", function () {
      $('.hamburger-list').offset({ left: 0 });
    });

    // メニューリスト非表示
    $(document).on('click',".fa-xmark", function () {
      $('.hamburger-list').offset({ left: -800 });
    });
    
  
    // メニューボタンアクション ---------------------------------
    $('#company_btn').on('click', async function () {
      if(!$('#company_btn').hasClass('select_marker')) {
        $('#work_btn').removeClass('select_marker');
        $('#company_btn').toggleClass('select_marker');
        $('#search_btn').removeClass('select_marker');
        await fadeIn();
        getCompanyPost();
        fadeOut();
      }
    });
  
    $('#work_btn').on('click', async function () {
      if(!$('#work_btn').hasClass('select_marker')) {
        $('#work_btn').toggleClass('select_marker');
        $('#company_btn').removeClass('select_marker');
        $('#search_btn').removeClass('select_marker');
        await fadeIn();
        await getWorkPost();
        fadeOut();
      }
    });
    // --------------------------------------------------------

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


    
     
    // 投稿情報取得
    async function getWorkPost() {
      fadeIn();
      $("#postList").empty();
      $("#post").empty();
      await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          if (window.matchMedia( "(max-width: 768px)" ).matches) {
            div2 = $(`<a class="post_work post_btn"><i id="post_icon" class="fa-solid fa-pen fa-2xs"></i>体験談</a>`);
          } else {
            div2 = $(`<a class="post_work post_btn"><i id="post_icon" class="fa-solid fa-pen fa-lg"></i>体験談を書く</a>`);
          }
          $("#post").append(div2); 
        }
      });
      db.collection("post").orderBy("createdAt", "desc").get().then((query) => {
        query.forEach((doc) => {
          var area;
          var industry;
          var image;
          var docId;
          var postUid;
          var memo = omittedContent(doc.data().memo);

          docId = doc.data().docId;
          postUid = doc.data().uid;
          if(doc.data().areaDetail != '未選択') {
            area = `${doc.data().area + ' ' + doc.data().areaDetail}`;
          } else {
            area = doc.data().area;
          }
          if(doc.data().industryDetail != '') {
            industry = `${doc.data().industry + ' ' + doc.data().industryDetail}`;
          } else {
            industry = doc.data().industry;
          }

          if(doc.data().images.length > 0) {
           post_img = doc.data().images[0];
          } else {
            post_img = "../static/image/noImage_post.png";
          }

          var div = $(`<div class="post" onclick="workDetail('${docId}', '${postUid}')">
                        <div class="content">
                          <h6>${industry}</h6>
                          <p>${area}</p>
                          <div class='content_row'>
                            <div id="content_img">
                              <img class='post_img' src="${post_img}">
                            </div>
                            <div id="content_text">
                              <p class="memo">${memo}</p>
                            </div>
                          </div>
                        </div>
                      </div>`);
          // 投稿情報表示
          $("#postList").append(div);
        });
      }).then(() => {
        fadeOut();
      })
      .catch((error)=>{
        console.log(`データの取得に失敗しました (${error})`);
      });
    }
  
    // 派遣会社投稿取得
   async function getCompanyPost() {
    var index = 0;
    $("#postList").empty();
    $("#post").empty();
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (window.matchMedia( "(max-width: 768px)" ).matches) {
          div2 = $(`<a class="post_company post_btn"><i id="post_icon" class="fa-solid fa-pen fa-2xs"></i>派遣会社レビュー</a>`);
        } else {
          div2 = $(`<a class="post_company post_btn"><i id="post_icon" class="fa-solid fa-pen fa-lg"></i>派遣会社レビューを書く</a>`);
        }
        $("#post").append(div2); 
      }
    });
    db.collection("companyReview").orderBy("createdAt", "desc").get().then((query) => {
      query.forEach((doc) => {
        var docId = doc.data().docId;
        var uid = doc.data().uid;
        var company = doc.data().company;
        var score = (doc.data().jobOffer + doc.data().hourlyWage + doc.data().support) / 3;
        var comment = doc.data().comment;  
        const comment_70 = omittedContent(comment);
   
        var div = $(`<div class="post" onclick="companyDetail('${docId}', '${uid}')">
                      <div class="content">
                        <h6>${company}</h6>
                        <div id="rating"><div class= score${index}></div><h6 class="score">${parseFloat(score.toFixed(1))}</h6></div>
                        <p id="comment">${comment_70}</p>
                      </div>
                    </div>`);
        // 投稿情報表示
        $("#postList").append(div); 
        $(`.score${index}`).raty({
          readOnly: true,
          targetKeep: true,
          precision: true,
          half: true,
          score : score,
          number : 5,
        });
        index++;
      });
    }).then(() => {
      fadeOut();
    })
    .catch((error)=>{
      console.log(`データの取得に失敗しました (${error})`);
    });
    }

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
}