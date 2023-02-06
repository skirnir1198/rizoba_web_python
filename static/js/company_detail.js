{
  const db = firebase.firestore();

   // URLSearchParamsオブジェクトを取得
   const url = new URL(window.location.href);
   const params = url.searchParams;
   const docId = params.get("docId");
   const postUserId = params.get("uid");
   const uid = sessionStorage.getItem('uid');
   var userName;
   var profile;
   var company;
   var jobOffer;
   var hourlyWage;
   var support;
   var comment;


  $(document).ready(
    async function(){
      $.ajaxSetup({cache:false});
      $("#header").load("./header.html");
      $.ajaxSetup({cache:false});
      $("#footer").load("./footer.html");
    }
  );

  db.collection("companyReview").doc(docId).get().then((doc)=>{
    company = doc.data().company;
    jobOffer = doc.data().jobOffer;
    hourlyWage = doc.data().hourlyWage;
    support = doc.data().support;
    comment = doc.data().comment;     
  }).then(() => {
    db.collection("user").doc(postUserId).get().then((user)=>{
      userName = user.data().userName;
      profile = user.data().profile;
      if(profile == '') {
        profile = "image/noImage.png"
      }
      if(uid == postUserId) {
        popUpMenu = `
        <ul class="menu">
          <li><i class="pop_up fa-solid fa-ellipsis"></i>
              <ul class="select_menu">
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
                <li class="report"><div><i class="fa-solid fa-flag"></i><p>報告する</p</div></li>
                <li class="block"><i class="fa-solid fa-ban"></i><p>ブロックする</p></li>
              </ul>
          </li>
        </ul>`;
      }

      $('#bottom').append(`
                          <div id="userInfo"><img src="${profile}"><div class='userName'>${userName}</div></div>
                          <div id="postData">
                            ${popUpMenu}
                            <div id="company">${company}</div>
                            <div id="rating"><h6>求人数</h6><div class="jobOffer"></div></div>
                            <div id="rating"><h6>時給</h6><div class="hourlyWage"></div></div>
                            <div id="rating"><h6>サポート</h6><div class="support"></div></div>
                            <div id="comment"><h6>${comment}</h6></div>
                          </div>`);
      $('.jobOffer').raty({
        readOnly: true,
        targetKeep: true,
        precision: true,
        half: false,
        score : jobOffer,
        number : 5,
      });
      $('.hourlyWage').raty({
        readOnly: true,
        targetKeep: true,
        precision: true,
        half: false,
        score : hourlyWage,
        number : 5,
      });
      $('.support').raty({
        readOnly: true,
        targetKeep: true,
        precision: true,
        half: false,
        score : support,
        number : 5,
      });
    });
  }).then(()=>{
    fadeOut();
  });

  $('body').on('click',function(){
    $('.menu ul').css('display', 'none');
    $('.fa-ellipsis').css('display', 'block');
  });

  // 3点リーダータップアクション
  $(document).on('click',".fa-ellipsis",function(e){
    $('.fa-ellipsis').css('display', 'none');
    $('.menu ul').css('display', 'block');
  });

  // 投稿削除機能
  $(document).on('click',".delete", async function(){
    fadeIn();
    await db.collection('companyReview')
    .doc(docId)
    .delete().then(() => {
      history.back();
    });
  });

  // 報告
  $(document).on('click',".report", async function(){
    window.location.href = `report.html?docId=${docId}&uid=${uid}&type="company"`;
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