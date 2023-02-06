{
  const db = firebase.firestore();
  const storage = firebase.storage();
  var date = new Date();
  var nowYear = date.getFullYear();
  var nowMonth = date.getMonth() + 1;
  // URLSearchParamsオブジェクトを取得
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const uid = params.get("uid");
  var sex;
  var uploadImages =[];

  async function uploadImage(id) {
    for(var i=0;i<$('#target')[0].files.length;i++) {
      var file = $('#target')[0].files[i];
      var ref = storage.ref().child('postImages').child(id).child('post').child(file.name);
      await ref.put(file);
      var url = await ref.getDownloadURL();
      await uploadImages.push(url);
    }
  }

  db.collection("user").doc(uid).get().then((doc)=>{
    sex = doc.get('sex');
  }).then(()=>{
    //エリア -------------------------------------------------
    for(var i=0; i<areaList.length; i++) {
      $("#selectArea").append(`<option value="${i}">${areaList[i]}</option>`);
    }

    for(var i=0; i<areaDetailList[0].length; i++) {
      $("#selectDetailArea").append(`<option value="0">${areaDetailList[0][i]}</option>`);
    }



    $('#selectArea').change(function(){
      const select = $('#selectArea').val();
      $("#selectDetailArea").empty();
      for(var i=0; i<areaDetailList[select].length; i++) {
        $("#selectDetailArea").append(`<option value="${i}">${areaDetailList[select][i]}</option>`);
      }
    });

      //業種 -------------------------------------------------


    for(var i=0; i<occupationList.length; i++) {
      $("#selectOccupation").append(`<option value="${i}">${occupationList[i]}</option>`);
    }

    $("#occupation_add").on('click', function() {
      $(this).css("display", "none");
      $("#occupation_minus").css("display", "block");
    });

    $("#minus_icon").on('click', function() {
      $("#occupation_minus").css("display", "none");
      $("#occupation_add").css("display", "inline-block");
    });

    //派遣会社 -------------------------------------------------

    for(var i=0; i<companyList.length; i++) {
      $("#selectCompany").append(`<option value="0">${companyList[i]}</option>`);
    }

    // 期間 ------------------------------------------------
    for(var i=nowYear; i>=1979; i--) {
      $("#startYear").append(`<option value="${i}">${i}年</option>`);
    }

    for(var i=12; i>=1; i--) {
      $("#startMonth").append(`<option value="${i}">${i}月</option>`);
    }

    for(var i=nowYear; i>=1979; i--) {
      $("#endYear").append(`<option value="${i}">${i}年</option>`);
    }

    for(var i=12; i>=1; i--) {
      $("#endMonth").append(`<option value="${i}">${i}月</option>`);
    }


    // 生年月日初期値設定-------------------------------------------
    $("#startYear").find(`option[value=${nowYear}]`).attr("selected", "selected");
    $("#startMonth").find(`option[value=${nowMonth}]`).attr("selected", "selected");
    $("#endYear").find(`option[value=${nowYear}]`).attr("selected", "selected");
    $("#endMonth").find(`option[value=${nowMonth}]`).attr("selected", "selected");
  })
  .then(()=> {
    fadeOut();
  });

   // 画像取得--------------------------------------------------
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
        $("#select_photo").prepend(`<li id="parent"><img src="${dataUri}"><i class="fas fa-times-circle" id="close"></i></li>`);
        if($("#select_photo li").length >= 3) {
          $("#target").prop('disabled', true);
        }  
      }
      // console.log($("#select_photo li").length);
    

      // ファイルをData URIとして読み込む
      fileReader.readAsDataURL( fileList[i] ) ;
    }

  
  });

  // アップロード画像表示--------------
  $('#target').change(function(e){
    file = e.target.files[0];
  });

  $(document).on('click','#close', function() {
    $(this).parent().remove();
    $("#target").prop("disabled", false);
  });

  $('#period_check').change(function() {
    if (this.checked) {
        $("#work_period").hide();
    }
    else {
      $("#work_period").show();
    }
});



  $("#add").click(async function() {
    fadeIn();
    var area = $('[name=area] option:selected').text();
    var areaDetail = $('[name=detailArea] option:selected').text();
    var industry = $('[name=industry] option:selected').text();
    var industryDetail = $("#occupation_detail").text();
    var company = $('[name=company] option:selected').text();
    var periodFlag = $("input[name=period_check]").prop("checked");
    var startYear = $('[name=startYear] option:selected').text();
    var startMonth = $('[name=startMonth] option:selected').text();
    var endYear = $('[name=endYear] option:selected').text();
    var endMonth = $('[name=endMonth] option:selected').text();
    var comment = $("#comment").val();
    const id = db.collection('post').doc().id;
    await uploadImage(id);

  
    await db.collection('post').doc(id).set({
      'workPlace': "",
      'industry': industry,
      'industryDetail': industryDetail,
      'company': company,
      'area': area,
      'areaDetail': areaDetail,
      'memo': comment,
      'images': uploadImages,
      'sex': sex,
      'startYear': startYear,
      'endYear': endYear,
      'startMonth': startMonth,
      'endMonth': endMonth,
      'periodFlag': periodFlag,
      'type': 'post',
      'uid': uid,
      'watchCount': '0',
      'goodCount': [],
      'docId': id,
      'createdAt': date,
    }).then(() => {
      window.location.href = 'index.html';
    });
  });
}