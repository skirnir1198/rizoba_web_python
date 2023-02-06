// URLSearchParamsオブジェクトを取得
const url = new URL(window.location.href);
const params = url.searchParams;
const uid = params.get("uid");
const db = firebase.firestore();

$(document).ready(function(){
    // html読み込み時に実行
    $.ajaxSetup({cache:false});
    $("#header").load("./header.html");
    $.ajaxSetup({cache:false});
    $("#footer").load("./footer.html");
    albumDisplay();
    fadeOut();
});
// アルバムページ表示
function albumDisplay() {
fadeIn();
$("#content").empty();
$("#content").append(`<h4 id='title'>アルバム一覧</h5>
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

// アルバム詳細ページ表示
$(document).on('click', '.albumLi', async function() {
  fadeIn();
  const id = $(this).attr('id');
  window.location.href = `album_detail.html?uid=${uid}&docId=${id}`;
  fadeOut();
});

// アルバム追加ボタン
$(document).on('click', '#album_add', function() {
  window.location.href = `album_add.html?uid=${uid}`;
});
