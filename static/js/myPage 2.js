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

  

    // マイページ編集ページへ遷移
    $(document).on('click','#edit', function () {
      window.location.href = `myPage_edit.html?uid=${uid}`;
    });

    // ログアウト
    $(".logout").on('click', function () {
      firebase.auth().signOut();
      window.location.href = 'index.html';
    });

    $(".profile").on('click', function () {
      getUserInfo();
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

    // お気に入り就業先ページ表示
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



    // お問い合わせ
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


    // 投稿情報取得
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

  // 派遣会社投稿取得
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
  // 自分の投稿情報取得
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

// 自分の派遣会社投稿取得
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

  function workDetail(docId) {
    window.location.href = `work_detail.html?docId=${docId}&uid=${uid}`;
  }

  function companyDetail(docId) {
    window.location.href = `company_detail.html?docId=${docId}&uid=${uid}`;
  }

  // ハンバーガメニュー
  $(function () {
    $('.js-btn').on('click', function () {        // js-btnクラスをクリックすると、
      console.log('click');
      $('.menu , .btn-line').toggleClass('open'); // メニューとバーガーの線にopenクラスをつけ外しする
    })
  });

  $("#icon_img").on('click', function () {
    window.location.href = "index.html";
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

}