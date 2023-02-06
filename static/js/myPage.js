{
  // URLSearchParamsオブジェクトを取得
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const uid = params.get("uid");
  var date = new Date();
  var img;
  var userName;
  var comment;
  var selectMenu = 'profile';
  var favoritePosts;
  var favoriteCompany;
  var blockUser;
  var select;
  const db = firebase.firestore();
  var images = [];
  var file;
  var files = [];
  let key = 0;
  const company_test = [
    'リゾバの目的はお金をガッツリ稼ぐこと',
    '1ヶ月以内の短期求人を探している',
    '今までリゾバをした事がある',
    '性別は女性ですか？',
    '友達同士またはカップルで応募したい',
    '海外留学を考えている',
    '沖縄または北海道で働きたい',
    'スタッフ特典は結構重要視している',
    '年齢は40代以上ですか？'
  ];
  var q_count = 1;
  var q_array = [];
  var q_num = 0;
  // dive, アルファ, グッドマン, ヒューマニック, ワクトリ
  var dive = 0;
  var alpha = 0;
  var goodman = 0;
  var humanic = 0;
  var wakutori = 0;
  var affiliate;
  // PC版
  if($(window).width() > 960) {
    affiliate  = [
      ``,
      `<a href="https://px.a8.net/svt/ejp?a8mat=3SZWNV+A9Q7G2+39C6+661TT" rel="nofollow" target="_blank" rel="noopener noreferrer">
      <img border="0" width="468" height="60" alt="" src="https://www24.a8.net/svt/bgt?aid=230103067621&wid=001&eno=01&mid=s00000015207001036000&mc=1"></a>
      <img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3SZWNV+A9Q7G2+39C6+661TT" alt="">`,
      ``,
      `<a href="https://px.a8.net/svt/ejp?a8mat=3SZWNV+A6R1F6+42GS+60H7L" rel="nofollow" target="_blank" rel="noopener noreferrer">
      <img border="0" width="468" height="60" alt="" src="https://www27.a8.net/svt/bgt?aid=230103067616&wid=001&eno=01&mid=s00000018982001010000&mc=1"></a>
      <img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3SZWNV+A6R1F6+42GS+60H7L" alt="">`,
      ``,
    ];
  } else {
    affiliate = [
      ``,
      `<a href="https://px.a8.net/svt/ejp?a8mat=3SZWNV+A9Q7G2+39C6+66OZ5" rel="nofollow" target="_blank" rel="noopener noreferrer">
      <img border="0" width="300" height="250" alt="" src="https://www26.a8.net/svt/bgt?aid=230103067621&wid=001&eno=01&mid=s00000015207001039000&mc=1"></a>
      <img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=3SZWNV+A9Q7G2+39C6+66OZ5" alt="">`,
      ``,
      `<a href="https://px.a8.net/svt/ejp?a8mat=3SZWNV+A6R1F6+42GS+60WN5" rel="nofollow" target="_blank" rel="noopener noreferrer">
      <img border="0" width="300" height="250" alt="" src="https://www28.a8.net/svt/bgt?aid=230103067616&wid=001&eno=01&mid=s00000018982001012000&mc=1"></a>
      <img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3SZWNV+A6R1F6+42GS+60WN5" alt="">`,
      ``,
    ]
  }

  $('#userInfo').on('inview', function() {
    // 要素がウィンドウの表示領域に現れたときに実行する処理
    fadeOut();
  });


  // html読み込み時に実行
  $(document).ready(function(){
    getUserInfo();
  });
  // メニュークリックアクション
  function clickMenu(item) {
    $(`.${item}`).addClass('select');
    $(`.${selectMenu}`).removeClass('select');
    selectMenu = item;
  }

  //  ハンバーガーメニュークリックアクション
  $(".btn").on('click', function(){
    $("#slide_menu").offset({left: 0});
    $("#slide_content").addClass('slowOpen')
  });
  
  //  ハンバーガーメニュー閉じる
  $("#close, #slide_menu, slide_content h5").on('click', function(){
    $("#slide_menu").offset({left: -1200});
    $("#slide_content").removeClass('slowOpen')
  });

  // ユーザー情報取得
  function getUserInfo() {
    $("#right").empty();
    db.collection("user").doc(uid).get().then((doc)=>{
      if(doc.get('profile') != '') {
        img = doc.get('profile');
      } else {
        img = 'image/noImage.png';
      }
      userName = doc.get('userName');
      comment = doc.get('comment');
      favoritePosts = doc.get('favoritePosts');
      favoriteCompany = doc.get('favoriteCompany');
      blockUser = doc.get('blockUser');
      $("#right").append(
        `<div id="userInfo">
          <div id="top"><img id="profile" src="${img}"><h4 id="userName">${userName}</h4><i id="edit" class="fa-solid fa-pen fa-lg"></i></div>
          <div id="comment">${comment}</div>
        </div>
        <div class="delete_account"><i class="fa-regular fa-trash-can fa-lg"></i><h5 id="delete">アカウント削除</h5></div>`
      );
    }).then(()=> {
      fadeOut();
    });
  }
// leftメニュー ---------------------------------------------------------
  // マイページ編集ページへ遷移
  $(document).on('click','#edit', function () {
    window.location.href = `myPage_edit.html?uid=${uid}`;
  });



  // アルバムページ表示関数
  $(".album").on('click', function () {
    albumDisplay();
  });

  // 診断テストページ表示関数
  $(".test").on('click', function () {
    testPage();
  });

  // プロフィールページ表示
  $(".profile").on('click', function () {
    getUserInfo();
  });

  // ハンバーガメニュー
  $(function () {
    $('.js-btn').on('click', function () {        // js-btnクラスをクリックすると、
      console.log('click');
      $('.menu , .btn-line').toggleClass('open'); // メニューとバーガーの線にopenクラスをつけ外しする
    })
  });

  // アイコンTopページ遷移
  $("#icon_img").on('click', function () {
    window.location.href = "index.html";
  });

// プロフィール ---------------------------------------------------------------------------------------------------------------------
  // 更新用画像取得--------------------------------------------------
  $("#target").on("change", function() {
    fadeIn();
    // フォームで選択された全ファイルを取得
    var fileList = this.files;
    // 個数分の画像を表示する
    for( var i=0,l=fileList.length; l>i; i++ ) {
      // FileReaderオブジェクトを作成
      var fileReader = new FileReader() ;
      // 読み込み後の処理を決めておく
      fileReader.onload = function() {
        // Data URIを取得
        var dataUri = this.result ;
        // HTMLに書き出し (src属性にData URIを指定)
        $("#select_photo").prepend('<a href="' + dataUri + '" target="_blank"><img src="' + dataUri + '"></a>');
      }
      // ファイルをData URIとして読み込む
      fileReader.readAsDataURL( fileList[i] ) ;
    }

    // 個数分の画像を表示する
    for( var i=0,l=fileList.length; l>i; i++ ) {
      // FileReaderオブジェクトを作成
      var fileReader = new FileReader() ;
      // 読み込み後の処理を決めておく
      fileReader.onload = function() {
        // Data URIを取得
        var dataUri = this.result ;
        urlList.push(dataUri);
        // ファイルをData URIとして読み込む
        fileReader.readAsDataURL( fileList[i] ) ;
        $("#select_photo").prepend('<a href="' + urlList[0] + '" target="_blank"><img src="' + urlList[0] + '"></a>');
      }
    }
    fadeOut();
  });  
  // アカウント削除
  $(document).on('click','.delete_account',function(){
    db.collection("user").doc(uid).update({
      'blockUser': [],
      'comment': '',
      'day': '0',
      'month': '0',
      'year': '0',
      'userName': '削除されたユーザー',
      'sex': '',
      'unreadLists': [],
      'email': '',
      'token': '',
      'password': '',
    }).then(() => {
      db.collection('deleted_users')
      .add({
        "uid": uid,
        "createdAt": date,
      }).then(()=>{
        firebase.auth().signOut();
        window.location.href = "index.html";
      });
    });
  });

  // お気に入り投稿ページ表示
  $(".favorite_post").on('click', function () {
    select = 'favorite';
    $("#right").empty();
    $("#right").append(`
      <div class="menu">
        <nav>
          <ul class="menu">
            <li id="work_btn" class="menu-list select_marker">就業先</li>
            <li id="company_btn" class="menu-list">派遣会社</li>
          </ul>
        </nav>
      </div>
      <div id="postList" class="col_2"></div>
    `);
    getWorkPost();
  });

  // 自分の投稿ページ表示
  $(".myPost").on('click', function () {
    select = 'myPost';
    $("#right").empty();
    $("#right").append(`
      <div class="menu">
        <nav>
          <ul class="menu">
            <li id="work_btn" class="menu-list select_marker">就業先</li>
            <li id="company_btn" class="menu-list">派遣会社</li>
          </ul>
        </nav>
      </div>
      <div id="postList" class="col_2"></div>
    `);
    getMyWorkPost();
  });

  // メニューボタンアクション(派遣会社) 
  $(document).on('click', '#company_btn', function () {
    if(!$('#company_btn').hasClass('select_marker')) {
      $('#company_btn').toggleClass('select_marker');
      $('#work_btn').removeClass('select_marker');
      if(select == 'favorite') {
        getCompanyPost();
      } else {
        getMyCompanyPost();
      }
    }
  });

  // メニューボタンアクション(就業先)
  $(document).on('click', '#work_btn', function () {
    if(!$('#work_btn').hasClass('select_marker')) {
      $('#work_btn').toggleClass('select_marker');
      $('#company_btn').removeClass('select_marker');
      if(select == 'favorite') {
        getWorkPost();
      } else {
        getMyWorkPost();
      }
    }
  });

  // ブロックユーザー表示
  $(".blockUser").on('click', function () {
    $("#right").empty();
    if(blockUser.length > 0) {
      $("#right").append("<h5 id='block_user_title'>ブロックしているユーザー</h5");
      db.collection("user").where("uid", "in", blockUser).get().then((query) => {
        if(query.docs.length > 0) {
          query.forEach((doc) => {
            var profile;
            var userName = doc.get('userName');
            var uid = doc.get('uid');
            if(doc.get('profile') == '') {
              profile = 'image/noImage.png';
            } else {
              profile = doc.get('profile');
            }

            $("#right").append(`
              <div class="block_user_info">
                <div><img src="${profile}"> <span class="userName">${userName}</span></div>
                <div id="${uid}" class="lift_btn">解除</div>
              </div>
            `);
          });
        }
      });
    } else {
      $("#right").append(`<h5>ブロックしているユーザーはいません</h5>`);
    }
  });



// アルバムページ ---------------------------------------------------------------------------------------------

  // アルバム一覧ページ -------------------------------------------------
  // アルバムページ表示
  function albumDisplay() {
    fadeIn();
    $("#right").empty();
    $("#right").append(`<h4 id='title'>アルバム一覧</h5>
      <ul id="albumList"></ul>
      <button id="album_add">アルバムを追加</button>
    `);
    db.collection("user").doc(uid).collection('album').orderBy("createdAt").get().then((query) => {
      query.forEach((doc) => {
        var li = $(`
        <li class="albumLi" id="${doc.get('docId')}")">
          <h4>${doc.get('title')}</h4>
          <img src="${doc.get('images')[0]}" id="firstImg">
        </li>`);
        // アルバムリスト
        $("#albumList").append(li); 
      });
    })
    .catch((error)=>{
      console.log(`データの取得に失敗しました (${error})`);
    });
    fadeOut();
  }

    $(document).on('change', '#imgs', function(e) {
      // フォームで選択された全ファイルを取得
      var fileList = this.files;
      $("#error_img").text('');
      // 画像最大30枚まで
      if(images.length + fileList.length > 30) {
        $("#error_img").text('画像は最大30枚までです');
        return;
      }
      // 個数分の画像を表示する
      for( var i=0,l=fileList.length; l>i; i++ ) {
        // FileReaderオブジェクトを作成
        var fileReader = new FileReader() ;
        // Data URIを取得
        fileReader.onload = (function (e) {
          $("#imgPreviewField").append(`<figure id="img-${key}" class="add_img"><img src="${e.target.result}"><i class="fa-regular fa-circle-xmark rmb fa-lg" id="${key}"></i></figure>`);
          key++;
          $("#imgLen").text(`${images.length}/30`);
        });
        // ファイルをData URIとして読み込む
        fileReader.readAsDataURL( fileList[i] ) ;
      }
      file = e.target.files;
      for(var i=0; i<file.length; i++) {
        images.push(file[i]);
      }
    });

  // アルバム画像削除
  $(document).on('click', `.rmb`, function() {
    const index = $('.rmb').index($(this));
    images.splice(index, 1);
    $(`#img-${$(this).attr('id')}`).remove();
    imgLen--;
    // key--;
    $("#imgLen").text(`${images.length}/30`);
  });

   // UUID生成
  function gen(len) {  
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'  
    const name = []  
    for (let i = 0; i < len; i++) {  
      const num = Math.floor(chars.length * Math.random())  
      name.push(chars[num])  
    }  
    return name.join('')  
  }  

  // アルバムアップロード
  $(document).on('click','#upload', async function(){
    fadeIn();
    $("#error_title").text('');
    $("#error_img").text('');
    var uploadImages = [];
    var date = new Date();
    const title = $('#input_title').val();
    const memo = $('#input_memo').val();
    if(title == '') {
      $("#error_title").text('タイトルは必須です');
      fadeOut();
      return;
    }
    if(images.length == 0) {
      $("#error_img").text('画像を1枚以上選択してください');
      fadeOut();
      return;
    }
    for (var i=0; i<images.length; i++) {
      $("#count_text").text(`${String(i)}/${images.length}`);
      $("#upload_text").text('アップロード中');
      var storageRef = firebase.storage().ref().child('album').child(uid).child(gen(16));
      await storageRef.put(images[i]);
      uploadImages.push(await storageRef.getDownloadURL());
    }
    const id = db.collection('user').doc(uid).collection('album').doc().id;
    await db.collection('user').doc(uid).collection('album').doc(id).set({
      'title': title,
      'memo': memo,
      'createdAt': date,
      'images': uploadImages,
      'docId': id,
      'uid': uid,
    });
    $("#count_text").text('');
    $("#upload_text").text('');
    albumDisplay();
    fadeOut();
  });
// アルバム詳細ページ --------------------------------------------------------------
  // 3点リーダータップアクション
  $(document).on('click',".fa-ellipsis",function(e){
    $('.fa-ellipsis').css('display', 'none');
    $('.popup_menu ul').css('display', 'block');
  });

  // ポップアップメニュー閉じる
  $('body').on('click',function(){
    $('.popup_menu ul').css('display', 'none');
    $('.fa-ellipsis').css('display', 'block');
  });
  // アルバム詳細ページ表示
  $(document).on('click', '.albumLi', async function() {
    fadeIn();
    $("#right").empty();
    $("#right").append('<h6 id="return_detail">←アルバム一覧へ</h6><div id="albumDetailPage"></div>');
    const id = $(this).attr('id');
    const data = await db.collection("user").doc(uid).collection('album').doc(id).get();
    var title = `<ul class="popup_menu">
                  <li><i class="pop_up fa-solid fa-ellipsis"></i>
                      <ul class="select_menu">
                        <li class="deleteAlbum" id="${id}"><i class="fa-solid fa-trash"></i><h6>削除</h6></li>
                      </ul>
                  </li>
                </ul>
                <h4 id="title">${data.get('title')}</h4>
                <div id="memo"><h5>${data.get('memo')}</h5></div>
                <div id="imageList"></div>`;
    $("#albumDetailPage").append(title); 
    for(var i=0; i<data.get('images').length; i++) {
      const img = `<a href="${data.get('images')[i]}" data-lightbox="group"><img src="${data.get('images')[i]}"></a>`;
      $("#imageList").append(img); 
    }
    fadeOut();
  });

  // アルバム削除
  $(document).on('click', '.deleteAlbum', async function() {
    fadeIn();
    const id = $(this).attr('id');
    const data = await db.collection("user").doc(uid).collection('album').doc(id).get();
    const img = data.get('images');
    for(var i=0; i<img.length; i++) {
      await firebase.storage().refFromURL(img[i]).delete();
    }
    await db.collection("user").doc(uid).collection('album').doc(id).delete();
    albumDisplay();
    fadeOut();
  });

  // アルバム一覧へ戻る
  $(document).on('click', '#return_detail', async function() {
    fadeIn();
    albumDisplay();
    fadeOut();
  });

// アルバム追加ページ ---------------------------------------------------------------------------
  // アルバム追加ページ表示
  $(document).on('click','#album_add', function () {
    fadeIn();
    $("#right").empty();
    $("#right").append(
    `<h6 id="return_detail">←アルバム一覧へ</h6>
    <div id="album_add_container">
      <p id="error_title"></p>
      <input type="text" id="input_title" name="name" required minlength="4" maxlength="20" size="10" placeholder="タイトル(必須)">
      <textarea id="input_memo" name="memo" placeholder="メモ"></textarea>
      <p id="error_img"></p>
      <label><div id="add_photo"><i class="fa-solid fa-camera"></i>画像</div>
      <input type='file' accept='image/*' multiple='multiple' id='imgs'">
      </label>
      <div id='imgLen'>0/30</div>
      <div id="imgPreviewField"></div>
    </div>
    <div id="upload">アップロード</div>
    `);
    fadeOut();
  });



// 診断テスト -------------------------------------------------------------------------------------
  function testPage() {
    fadeIn();
    $("#right").empty();
    $("#right").append(`
      <div id="company_test">派遣会社診断</div>
    `);
    fadeOut();
  }

  $(document).on('click', '#company_test', function() {
    fadeIn();
    $("#right").empty();
    $("#right").append(`
    <div id="content">
      <div id="q_title">Q${q_count}.${company_test[q_num]}</div>
      <div id="btn_content"><div id="ans_btn" data-id='0'>はい</div><div id="ans_btn" data-id='1'>いいえ</div></div>
    </div>
    `);
    fadeOut();
  });

  // テスト終了
  $(document).on('click', '#ans_btn', function() {
    if(q_num == 8){
      $("#content").empty();
      $("#content").append(`
      <div id="content">
        <div id="q_title">診断中...</div>
      </div>
      `);
      // dive, アルファ, グッドマン, ヒューマニック, ワクトリ

      // お金をガッツリ稼ぎたいですか？
      if(q_array[0] == 0) {
        goodman+= 2;
        humanic++;
        wakutori++;
      }
      // 1ヶ月以内の短期求人を探している
      if(q_array[1] == 0) {
        humanic+=2;
        wakutori++;
        goodman++;
      // 長期求人を探している
      } else {
        alpha+=2;
        wakutori++;
      }
      // 今までリゾバをした事がある
      if(q_array[2] == 0) {
        dive+=2;
      }
      // 性別は女性ですか？
      if(q_array[3] == 0) {
        alpha+=2;
      }
      // 友達同士またはカップルで応募したい
      if(q_array[4] == 0) {
        humanic+=2;
        goodman++;
      }
      // 海外留学を考えている
      if(q_array[5] == 0) {
        alpha++;
        humanic++;
        dive++;
      }
      // 沖縄または北海道で働きたい
      if(q_array[6] == 0) {
        humanic++;
        goodman++;
        alpha++;
      }
      // スタッフ特典は結構重要視している
      if(q_array[7] == 0) {
        alpha+=2;
        dive++;
        humanic++;
      }
      // 年齢は40代以上ですか？
      if(q_array[8] == 0) {
        humanic++;
        goodman++;
      }
      // dive, アルファ, グッドマン, ヒューマニック, ワクトリ
      var q_company = [dive,alpha,goodman,humanic,wakutori];
      var company_name = ['Dive', 'アルファリゾート', 'グッドマンサービス', 'ヒューマニック', 'ワクトリ'];
      const max = Math.max.apply(null, q_company);
      const ans = company_name[q_company.indexOf(max)];
      const affili = affiliate[q_company.indexOf(max)];
      setTimeout(function(){
        $("#content").empty();
        $("#content").append(`
          <h5 id="q_title">あなたにおすすめの派遣会社は</h5>
          <div id="q_ans">${ans}</div>
          <h5 id="register">さっそく登録↓↓</h5>
          ${affili}
          <div id="return_test">もう一度診断してみる</div>
        `);
      },2000);
      q_count = 1;
      q_array = [];
      q_num = 0;
      q_company = [0,0,0,0,0];
      return;
    }
    var id =  Number($(this).data('id'));
    q_array.push(id);
    q_count++;
    q_num++;
    $("#content").empty();
    $("#content").append(`
    <div id="content">
      <div id="q_title">Q${q_count}.${company_test[q_num]}</div>
      <div id="btn_content"><div id="ans_btn" data-id='0'>はい</div><div id="ans_btn" data-id='1'>いいえ</div></div>
    </div>
    `);
  });

  // もう一度テスト
  $(document).on('click','#return_test', function () {
    q_count = 1;
    q_array = [];
    q_num = 0;
    q_company = [0,0,0,0,0];
    fadeIn();
    $("#right").empty();
    $("#right").append(`
    <div id="content">
      <div id="q_title">Q${q_count}.${company_test[q_num]}</div>
      <div id="btn_content"><div id="ans_btn" data-id='0'>はい</div><div id="ans_btn" data-id='1'>いいえ</div></div>
    </div>
    `);
    fadeOut();
  });



     

// ブロックユーザー ------------------------------------------------------------------------------------------------
    // ブロックユーザー解除
    $(document).on('click','.lift_btn', function () {
      const id = $(this).attr('id');
      var newList = jQuery.grep(blockUser, function(value) {
        return value != id;
      });
      blockUser = newList;
      db.collection('user').doc(uid).update({
        'blockUser': newList,
      }).then(() => {
        $("#right").empty();
        if(blockUser.length > 0) {
          db.collection("user").where("uid", "in", blockUser).get().then((query) => {
            if(query.docs.length > 0) {
              query.forEach((doc) => {
                var profile;
                var userName = doc.get('userName');
                var uid = doc.get('uid');
                if(doc.get('profile') == '') {
                  profile = 'image/noImage.png';
                } else {
                  profile = doc.get('profile');
                }
                $("#right").append(`
                  <div class="block_user_info">
                    <div><img src="${profile}"> <span class="userName">${userName}</span></div>
                    <div id="${uid}" class="lift_btn">解除</div>
                  </div>
                `);
              });
            }
          });
        } else {
          $("#right").append(`<h5>ブロックしているユーザーはいません</h5>`);
        }
      });
    });



// お問い合わせ --------------------------------------------------------------------------------------------------------
    $(".inquiry").on('click', function () {
      $("#right").empty();
      $("#right").append(`
        <div id="inquiry">
          <h5>お問い合わせ種別</h5>
          <select id="type" name="type">
            <option>不具合報告</option>
            <option>このアプリ機能について</option>
            <option>要望</option>
            <option>その他</option>
          </select>
          <h5>お問い合わせ内容</h5>
          <textarea id="content" rows="5"></textarea>
          <div id="send_btn"><h5>送信</h5><div>
        </div>
      `);
    });
  
// お問い合わせ内容送信ボタン
    $(document).on('click','#send_btn', async function () {
      var type = $("#type").val();
      var content =  $("#content").val();
      await db.collection('inquiry').doc().set({
        contents: content,
        createdAt: date,
        genre: type,
        sendUserId :uid
      });
    });


// 就業先投稿情報取得---------------------------------------------------------------------------------------------------------
    function getWorkPost() {
      $("#postList").empty();
      if(favoritePosts !== undefined) {
        db.collection("post").where("docId", "in", favoritePosts).get().then((query) => {
        query.forEach((doc) => {
          var area;
          var industry;
          var image;
          var docId;
          var memo = doc.data().memo;
          docId = doc.data().docId;
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
            image = `<img class='post_img' src=${doc.data().images[0]}>`;
          } else {
            image = "<img class='post_img' src='image/noImage_post.png'>";
          }
          var div = $(`
          <div class="post" onclick="workDetail('${docId}')">
            <div class="content">
              <h4>${area}</h4>
                <h4>${industry}</h4>
                  <div class='content_row'>${image}<h4 class="memo">${memo}</h4></div>
            </div>
          </div>`);
          // 投稿情報表示
          $("#postList").append(div); 
        });
      })
      .catch((error)=>{
        console.log(`データの取得に失敗しました (${error})`);
      });
    } else {
      $("#postList").append('<h5>お気に入りの投稿はありません</h5>'); 
    }
  }

// 派遣会社投稿取得 --------------------------------------------------------------------------------------------------------
  function getCompanyPost() {
    var index = 0;
    $("#postList").empty();
    if(favoriteCompany !== undefined) {
      db.collection("companyReview").where("docId", "in", favoriteCompany).get().then((query) => {
        query.forEach((doc) => {
          var docId = doc.data().docId;
          var company = doc.data().company;
          var score = (doc.data().jobOffer + doc.data().hourlyWage + doc.data().support) / 3;
          var comment = doc.data().comment;     
          var div = $(`<div class="post" onclick="companyDetail('${docId}')">
                        <div class="content">
                          <h6>${company}</h6>
                          <div id="rating"><div class= score${index}></div><h6 class="score">${parseFloat(score.toFixed(1))}</h6></div>
                          <p>${comment}</p>
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
      })
      .catch((error)=>{
        console.log(`データの取得に失敗しました (${error})`);
      });
    } else {
      $("#postList").append('<h5>お気に入りの投稿はありません</h5>');
    }
  }
// 自分の投稿情報取得 --------------------------------------------------------------------------------------------------------
  function getMyWorkPost() {
    $("#postList").empty();
    db.collection("post").where("uid", "==", uid).get().then((query) => {
      if(query.docs.length > 0) {
        query.forEach((doc) => {
          var area;
          var industry;
          var image;
          var docId;
          var memo = doc.data().memo;
          docId = doc.data().docId;
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
            image = `<img class='post_img' src=${doc.data().images[0]}>`;
          } else {
            image = "<img class='post_img' src='image/noImage_post.png'>";
          }
          var div = $(`
          <div id="my_post" class="post" onclick="workDetail('${docId}')">
            <div class="content">
              <h6>${area}</h6>
                <h6>${industry}</h6>
                  <div class='content_row'>${image}<p  id="comment">${memo}</p></div>
            </div>
          </div>`);
          // 投稿情報表示
          $("#postList").append(div); 
        });
    } else {
      $("#postList").append('<h5>自分の投稿はありません</h5>'); 
    }
  })
  .catch((error)=>{
    console.log(`データの取得に失敗しました (${error})`);
  });
}

// 自分の派遣会社投稿取得 --------------------------------------------------------------------------------------------------------
  function getMyCompanyPost() {
    var index = 0;
    $("#postList").empty();
      db.collection("companyReview").where("uid", "==", uid).get().then((query) => {
        if(query.docs.length > 0) {
          query.forEach((doc) => {
            var docId = doc.data().docId;
            var company = doc.data().company;
            var score = (doc.data().jobOffer + doc.data().hourlyWage + doc.data().support) / 3;
            var comment = doc.data().comment;     
            var div = $(`<div id="my_post" class="post" onclick="companyDetail('${docId}')">
                          <div class="content">
                            <h6>${company}</h6>
                            <div id="rating"><div class= score${index}></div><h6 class="score">${parseFloat(score.toFixed(1))}</h6></div>
                            <p id="comment">${comment}</p>
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
        } else {
          $("#postList").append('<h5>自分の投稿はありません</h5>');
        }
      })
      .catch((error)=>{
        console.log(`データの取得に失敗しました (${error})`);
      });
  }

  // 就業先詳細ページ遷移
  function workDetail(docId) {
    window.location.href = `work_detail.html?docId=${docId}&uid=${uid}`;
  }

  // 派遣会社レビュー詳細ページ遷移
  function companyDetail(docId) {
    window.location.href = `company_detail.html?docId=${docId}&uid=${uid}`;
  }
}