// URLSearchParamsオブジェクトを取得
const url = new URL(window.location.href);
const params = url.searchParams;
const docId = params.get("docId");
const uid = params.get("uid");
const db = firebase.firestore();

// アルバム詳細ページ表示
$(document).ready(async function(){
  // html読み込み時に実行
  $.ajaxSetup({cache:false});
  $("#header").load("./header.html");
  $.ajaxSetup({cache:false});
  $("#footer").load("./footer.html");
  const data = await db.collection("user").doc(uid).collection('album').doc(docId).get();
  $("#title").text(data.get('title'));
  $("#memo").text(data.get('memo'));
  for(var i=0; i<data.get('images').length; i++) {
    const img = `<a href="${data.get('images')[i]}" data-lightbox="group"><img src="${data.get('images')[i]}"></a>`;
    $("#imageList").append(img); 
  }
  fadeOut();
});

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

  // アルバム削除
$(document).on('click', '.deleteAlbum', async function() {
    fadeIn();
    console.log(docId);
    const data = await db.collection("user").doc(uid).collection('album').doc(docId).get();
    const img = data.get('images');
    for(var i=0; i<img.length; i++) {
      await firebase.storage().refFromURL(img[i]).delete();
    }
    await db.collection("user").doc(uid).collection('album').doc(docId).delete();
    fadeOut();
    history.back();
});

// アルバム一覧へ戻る
$(document).on('click', '#return_detail', async function() {
    window.location.href = `album.html?uid=${uid}`;
});