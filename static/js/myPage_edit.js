{
  // URLSearchParamsオブジェクトを取得
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const uid = params.get("uid");
  var img;
  var userName;
  var comment;
  var year;
  var month;
  var day;
  var sex;
  var file;
  var date = new Date();
  var nowYear = date.getFullYear();
  const db = firebase.firestore();

  $(document).ready(
    async function(){
    $.ajaxSetup({cache:false});
    $("#header").load("./header.html");
    $.ajaxSetup({cache:false});
    $("#footer").load("./footer.html");
    }
  );

  // ユーザー情報取得------------------------------------------
  db.collection("user").doc(uid).get().then((doc)=>{
    if(doc.get('profile') != '') {
      img = doc.get('profile');
    } else {
      img = 'image/noImage.png';
    }
    userName = doc.get('userName');
    comment = doc.get('comment');
    year = doc.get('year');
    month = doc.get('month');
    day = doc.get('day');
    sex = doc.get('sex');

    // 値を表示-----------------------------
    $('#userName').val(userName);
    $('#profile').attr("src", img);
    $('#comment').val(comment);

    // 生年月日リスト表示---------------------------
    for(var i=1979; i<=nowYear; i++) {
      if(i == 1979) {
        $("#year").append(`<option value="1979">---年</option>`);
      } else {
        $("#year").append(`<option value="${i}">${i}年</option>`);
      }
    }
  
    for(var i=0; i<=12; i++) {
      if(i == 0) {
        $("#month").append(`<option value="0">---月</option>`);
      } else {
        $("#month").append(`<option value="${i}">${i}月</option>`);
      }
    }
  
    for(var i=0; i<=31; i++) {
      if(i == 0) {
        $("#day").append(`<option value="0">---日</option>`);
      } else {
        $("#day").append(`<option value="${i}">${i}日</option>`);
      }
    }

    // 生年月日初期値設定-------------------------------------------
    $("#year").find(`option[value=${year}]`).attr("selected", "selected");
    $("#month").find(`option[value=${month}]`).attr("selected", "selected");
    $("#day").find(`option[value=${day}]`).attr("selected", "selected");
    $(`#${sex}`).prop('checked', true);
  }).then(()=>{
    fadeOut();
  });


  // 更新用画像取得--------------------------------------------------
  document.getElementById( "target" ).addEventListener( "change", function() {
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
        $("#profile").remove();
      }

      // ファイルをData URIとして読み込む
      fileReader.readAsDataURL( fileList[i] ) ;
    }
  });

  // アップロード画像表示--------------
  $('#target').change(function(e){
    file = e.target.files[0];
  });

  // 更新関数--------------------------------------------------------------
  $('#update').on('click', async function  () {
    fadeIn();
    var url;
    const userName = $('#userName').val();
    const comment = $('#comment').val();
    var year = $("#year").val();
    var month = $("#month").val();
    var day = $("#day").val();
    var input_gender = document.querySelector("input[name=gender]:checked");
    if(userName.length == 0) {
      $("#error").text('*ユーザー名は必須です');
      fadeOut();
      return '';
    }
    if(typeof file === 'undefined') {
      url =img;
    } else {
      var ref = firebase.storage().ref().child('userProfile').child(uid).child(file.name);
      await ref.put(file);
      url = await ref.getDownloadURL();
    }
    await db.collection('user').doc(uid).update({
      'comment': comment,
      'profile': url,
      'userName': userName,
      'year': year,
      'month': month,
      'day': day,
      'sex': input_gender.value,
    });
    history.back();
  });

  $(document).on('click','#delete_account',function(){
    var result = window.confirm("データが全て削除されますがよろしいですか？");
    if(result) {
      // アカウント削除
      $(document).on('click','#',function(){
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
  });
}