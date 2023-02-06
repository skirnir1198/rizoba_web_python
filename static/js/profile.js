{
    // URLSearchParamsオブジェクトを取得
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const uid = params.get("uid");
    const db = firebase.firestore();
    var date = new Date();
    var img;
    var userName;
    var comment;
    var selectMenu = 'profile';

    
    $('#userInfo').on('inview', async function() {
      // 要素がウィンドウの表示領域に現れたときに実行する処理
      fadeOut();
    });
  
    // html読み込み時に実行
    $(document).ready(function(){
      $.ajaxSetup({cache:false});
      $("#header").load("./header.html");
      $.ajaxSetup({cache:false});
      $("#footer").load("./footer.html");
      getUserInfo();
      getMyWorkPost();
    });
  
    // ユーザー情報取得
    function getUserInfo() {
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
            <div id="top">
              <img id="profile" src="${img}">
              <div id="name_edit">
                <h4 id="userName">${userName}</h4>
                <i id="edit" class="fa-solid fa-pen fa-lg"></i>
              </div>
            </div>
            <div id="comment">${comment}</div>
          </div>
          `
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

      // メニュークリックアクション
    $(document).on('click','#work_btn', function () {
      if(!$(this).hasClass(".select")) {
        $(this).addClass('select');
        $("#company_btn").removeClass('select');
        getMyWorkPost();
      }
    });

    // 派遣会社投稿表示
    $(document).on('click','#company_btn', function () {
      if(!$(this).hasClass(".select")) {
        $(this).addClass('select');
        $("#work_btn").removeClass('select');
        getMyCompanyPost();
      }
    });



  // 自分の就業先投稿情報取得 --------------------------------------------------------------------------------------------------------
    function getMyWorkPost() {
      $("#items").empty();
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
            <div id="${docId}" class="post work_post">
              <div class="content">
                <h6>${area}</h6>
                  <h6>${industry}</h6>
                    <div class='content_row'>${image}<p  id="comment">${memo}</p></div>
              </div>
            </div>`);
            // 投稿情報表示
            $("#items").append(div); 
          });
      } else {
        $("#items").append('<h5 id="no_item">自分の投稿はありません</h5>'); 
      }
    })
    .catch((error)=>{
      console.log(`データの取得に失敗しました (${error})`);
    });
  }

  // 就業先詳細ページ
  $(document).on('click','.work_post', function () {
    const id = $(this).attr('id');
    window.location.href = `work_detail.html?uid=${uid}&docId=${id}`;
  });
  
  // 自分の派遣会社投稿取得 --------------------------------------------------------------------------------------------------------
    function getMyCompanyPost() {
      var index = 0;
      $("#items").empty();
        db.collection("companyReview").where("uid", "==", uid).get().then((query) => {
          if(query.docs.length > 0) {
            query.forEach((doc) => {
              var docId = doc.data().docId;
              var company = doc.data().company;
              var score = (doc.data().jobOffer + doc.data().hourlyWage + doc.data().support) / 3;
              var comment = doc.data().comment;     
              var div = $(`<div id="${docId}" class="post company_post">
                            <div class="content">
                              <h6>${company}</h6>
                              <div id="rating"><div class= score${index}></div><h6 class="score">${parseFloat(score.toFixed(1))}</h6></div>
                              <p id="comment">${comment}</p>
                            </div>
                          </div>`);
              // 投稿情報表示
              $("#items").append(div); 
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
            $("#items").append('<h5 id="no_item">自分の投稿はありません</h5>');
          }
        })
        .catch((error)=>{
          console.log(`データの取得に失敗しました (${error})`);
        });
    }
  // 就業先詳細ページ
  $(document).on('click','.company_post', function () {
    const id = $(this).attr('id');
    window.location.href = `company_detail.html?uid=${uid}&docId=${id}`;
  });
}