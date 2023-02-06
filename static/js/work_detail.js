{
  const db = firebase.firestore();
  const storage = firebase.storage();

   // URLSearchParamsオブジェクトを取得
   const url = new URL(window.location.href);
   const params = url.searchParams;
   const docId = params.get("docId");
   const postUserId = params.get("uid");
   const uid = sessionStorage.getItem('uid');
   var userName;
   var postArea;
   var areaDetail;
   var sex;
   var year;
   var month;
   var day;
   var company;
   var createdAt;
   var startYear;
   var startMonth;
   var endYear;
   var endMonth;
   var images;
   var industry;
   var industryDetail;
   var memo;
   var periodFlag;
   var watchCount;
   var popUpMenu;

   $(document).ready(
    async function(){
      $.ajaxSetup({cache:false});
      $("#header").load("./header.html");
      $.ajaxSetup({cache:false});
      $("#footer").load("./footer.html");
    }
  );

  //  投稿情報取得
   db.collection("post").doc(docId).get().then((doc)=>{
    postArea = doc.data().area;
    areaDetail = doc.data().areaDetail;
    company = doc.data().company;
    startYear = doc.data().startYear;
    startMonth = doc.data().startMonth;
    endYear = doc.data().endYear;
    endMonth = doc.data().endMonth;
    createdAt = doc.data().createdAt;
    images = doc.data().images;
    industry = doc.data().industry;
    industryDetail = doc.data().industryDetail;
    memo = doc.data().memo;
    periodFlag = doc.data().periodFlag;
    watchCount = doc.data().watchCount;
   }).then(() => {
    // 投稿ユーザー情報取得
    db.collection("user").doc(postUserId).get().then((user)=>{
      userName = user.data().userName;
      sex = user.data().sex;
      year = user.data().year;
      month = user.data().month;
      day = user.data().day;
      var areaPost;
      var industryPost;
      var period;
      var sexPost;
      var yearPost;
      var imagePost = "<div id='image_containers'>";
      const birth = `${year}/${month}/${day}`
      const today = new Date(createdAt.seconds * 1000);
      const formatted = today
        .toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      if(areaDetail != '未選択') {
        areaPost = `${area}(${areaDetail})`;
      } else {
        areaPost = `${area}`;
      }
      if(industryDetail != '') {
        industryPost = `${industry}<br>(${industryDetail})`;
      } else {
        industryPost = `${industry}`;
      }
      if(periodFlag) {
        period = "<h6>非公開</h6>";
      } else {
        period = `<h6>${startYear}月${startMonth}月 ~ ${endYear}年${endMonth}月</h6>`
      }
      switch (sex){
        case '0':
          sexPost = '未選択';
          break;
        case '1':
          sexPost = '男性';
          break;
        case '2':
          sexPost = '女性';
          break;
      }
      const age = ageCalculation( new Date(birth) , new Date() );
      if(year == '1979') {
        yearPost = '未選択';
      } else {
        if(age < 20) {
          yearPost = '10代';
        } else if(age < 30) {
          yearPost = '20代';
        } else if(age < 40) {
          yearPost = '30代';
        } else if(age < 50) {
          yearPost = '40代';
        } else if(age < 60) {
          yearPost = '50代';
        } else {
          yearPost = '60代';
        }
      }
      // 投稿写真
      if(images.length > 0) {
        for(var i=0; i<images.length; i++) {
          imagePost += `<a href="${images[i]}" data-lightbox="demo"><div id="image_container"><img src="${images[i]}" id="postImg" class="space_top"></div></a>`;
        }
      }

      imagePost += "</div>";

      if(uid == postUserId) {
        popUpMenu = `
        <ul class="menu">
          <li><i class="pop_up fa-solid fa-ellipsis"></i>
              <ul class="select_menu">
                <li class="edit"><div><i class="fa-solid fa-pen"></i><p>編集</p></div></li>
                <li class="delete"><i class="fa-solid fa-trash"></i><p>削除</p></li>
              </ul>
          </li>
        </ul>`;
      } else if(uid == '') {
        popUpMenu = '';
      } else {
        popUpMenu = `
        <ul class="menu">
          <li><i class="pop_up fa-solid fa-ellipsis"></i>
            <ul class="select_menu">
              <li class="report"><div><i class="fa-solid fa-flag"></i><p>報告する</p></div></li>
              <li class="block"><i class="fa-solid fa-ban"></i><p>ブロックする</p></li>
            </ul>
          </li>
        </ul>`;
      }
       console.log(industryPost);
      $('#bottom').append(`<div id="userInfo">
                          <h6 class='userName'>投稿者 ${userName}</h6>
                          <h6 class='postDate'>投稿日 ${formatted}</h6>
                        </div>
                        <div id="postData">
                          ${popUpMenu}
                          <h6 class="grey_font">エリア</h6>
                          <h5 class="input_text">${postArea}</h5>
                          <h6 class="grey_font">業種</h6>
                          <h5 class="input_text">${industryPost}</h5>
                          <h6 class="grey_font">派遣会社</h6>
                          <h5 class="input_text">${company}</h5>
                          <h6 class="grey_font">期間</h6>
                          <h5 class="input_text">${period}</h5>
                          <div id="sex_age">
                            <h6 class="grey_font" style="display:inline;">性別</h6> <h6 class="space_top" style="display:inline;">${sexPost}</h6><h6 class="grey_font" style="display:inline;"> 年代</h6> <h6 class="space_top" style="display:inline;">${yearPost}</h6>
                          </div>
                          <div id="comment">
                            <h5>内容</h5>
                            <h6 id="memo">${memo}</h6>
                            ${imagePost}
                          </div>
                        </div>
                        </div>`);

    }).then(()=>{
      fadeOut();
    });
   });
   

  const ageCalculation = ( birthDate , nowDate ) => {
    const birthNumber = birthDate.getFullYear() * 10000 
                               + (birthDate.getMonth() + 1 ) * 100 
                               + birthDate.getDate();
    const nowNumber = nowDate.getFullYear() * 10000 
                               + (nowDate.getMonth() + 1 ) * 100 
                               + nowDate.getDate();
 
    return Math.floor( (nowNumber - birthNumber) / 10000 );
  }

  $('body').on('click',function(){
    $('.menu ul').css('display', 'none');
    $('.fa-ellipsis').css('display', 'block');
  });

  // 3点リーダータップアクション
  $(document).on('click',".fa-ellipsis",function(e){
    $('.fa-ellipsis').css('display', 'none');
    $('.menu ul').css('display', 'block');
  });

  // 編集ページへ遷移
  $(document).on('click',".edit",function(){
    window.location.href = `work_edit.html?docId=${docId}&uid=${uid}`;
  });

  // 投稿削除機能
  $(document).on('click',".delete", async function(){
    fadeIn();
    if(images.length > 0) {
      for(var i=0; i<images.length; i++) {
        await storage
        .refFromURL(images[i])
        .delete().then(() => {
           console.log('success');
        }).catch(error => {
            console.log(error);
        });
      }
    }
    await db.collection('post')
    .doc(docId)
    .delete().then(() => {
      history.back();
    });
  });

  // 報告
  $(document).on('click',".report", async function(){
    window.location.href = `report.html?docId=${docId}&uid=${uid}&type="work"`;
  });

   // ブロック
   $(document).on('click',".block", async function(){
    var blockUser;
    $("#div1").dialog({
      modal:true, //モーダル表示
      dialogClass: 'noTitleDialog',
      width: 400,
			buttons: { //ボタン
        "確認": function() {
          //  投稿情報取得
          db.collection("user").doc(uid).get().then((doc)=>{
            blockUser = doc.data().blockUser;
            blockUser.push(postUserId);
            db.collection("user").doc(uid).update({
              'blockUser': blockUser,
            }).then(() => {
              window.location.href = `index.html`;
            });
          });          
        },
        "キャンセル": function() {
          $(this).dialog("close"); 
        }
      }
    });
  });
  
}