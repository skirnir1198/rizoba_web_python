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

  
    $('#userInfo').on('inview', function() {
      // 要素がウィンドウの表示領域に現れたときに実行する処理
      fadeOut();
    });
  
  
    // html読み込み時に実行
    $(document).ready(function(){
        $.ajaxSetup({cache:false});
        $("#header").load("./header.html");
        $.ajaxSetup({cache:false});
        $("#footer").load("./footer.html");
        fadeOut();    
    });

// お問い合わせ内容送信ボタン
  $(document).on('click','#send_btn', async function () {
    fadeIn();
    $("#error").text('');
    var type = $("#type").val();
    var content =  $("#content").val();
    if(content == '') {
        $("#error").text('お問い合わせ内容を入力してください');
        return;
    }
    await db.collection('inquiry').doc().set({
      contents: content,
      createdAt: date,
      genre: type,
      sendUserId :uid
    });
    $("#main").empty();
    $("#main").append(`<div id="send_finish">
        <h5>お問い合わせありがとうございます。</h5>
        <a href="index.html">Topへ戻る</a></div>`
    );
    fadeOut();
  });

}