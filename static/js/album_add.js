const db = firebase.firestore();
// URLSearchParamsオブジェクトを取得
const url = new URL(window.location.href);
const params = url.searchParams;
const uid = params.get("uid");
var images = [];
var file;
var files = [];
let key = 0;

$(document).ready(function(){
    // html読み込み時に実行
    $.ajaxSetup({cache:false});
    $("#header").load("./header.html");
    $.ajaxSetup({cache:false});
    $("#footer").load("./footer.html");
    fadeOut();
});

$(document).on('click', `#return_detail`, function() {
  history.back();
});


// 追加画像枚数変更
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
    window.location.href = `album.html?uid=${uid}`;
    fadeOut();
});