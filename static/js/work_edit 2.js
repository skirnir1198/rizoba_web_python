{
  const db = firebase.firestore();
  var date = new Date();
  var nowYear = date.getFullYear();
  var nowMonth = date.getMonth() + 1;
  // URLSearchParamsオブジェクトを取得
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const docId = params.get("docId");
  var uid = params.get("uid");
  var area;
  var areaDetail;
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

 //  投稿情報取得
  db.collection("post").doc(docId).get().then((doc)=>{
   area = doc.data().area;
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
     //エリア -------------------------------------------------
     for(var i=0; i<areaList.length; i++) {
      if(area == areaList[i]) {
        $("#selectArea").append(`<option value="${i}" selected>${areaList[i]}</option>`);
        for(var n=0; n<areaDetailList[i].length; n++) {
          if(areaDetail == areaDetailList[i][n]) {
            $("#selectDetailArea").append(`<option value="0" selected>${areaDetailList[i][n]}</option>`);
          } else {
            $("#selectDetailArea").append(`<option value="0">${areaDetailList[i][n]}</option>`);
          }
        }
      } else {
        $("#selectArea").append(`<option value="${i}">${areaList[i]}</option>`);
      }
    }

    //業種 -------------------------------------------------
    for(var i=0; i<occupationList.length; i++) {
      if(industry == occupationList[i]) {
        $("#selectOccupation").append(`<option value="${i}" selected>${occupationList[i]}</option>`);
      } else {
        $("#selectOccupation").append(`<option value="${i}">${occupationList[i]}</option>`);
      }
    }

    $("#occupation_detail").val(`${industryDetail}`);

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
      if(company == companyList[i]) {
        $("#selectCompany").append(`<option value="0" selected>${companyList[i]}</option>`);
      } else {
        $("#selectCompany").append(`<option value="0">${companyList[i]}</option>`);
      }
    }

    // 期間 ------------------------------------------------
    for(var i=nowYear; i>=1979; i--) {
      var year = startYear.replace(/年/g, '');
      if(year == i) {
        $("#startYear").append(`<option value="${i}" selected>${i}年</option>`);
      } else {
        $("#startYear").append(`<option value="${i}">${i}年</option>`);
      }
    }

    for(var i=12; i>=1; i--) {
      var month = startMonth.replace(/月/g, '');
      if(month == i) {
        $("#startMonth").append(`<option value="${i}" selected>${i}月</option>`);
      } else {
        $("#startMonth").append(`<option value="${i}">${i}月</option>`);
      }
    }

    for(var i=nowYear; i>=1979; i--) {
      var year = endYear.replace(/年/g, '');
      if(year == i) {
        $("#endYear").append(`<option value="${i}" selected>${i}年</option>`);
      } else {
        $("#endYear").append(`<option value="${i}">${i}年</option>`);
      }
    }

    for(var i=12; i>=1; i--) {
      var month = endMonth.replace(/月/g, '');
      if(month == i) {
        $("#endMonth").append(`<option value="${i}" selected>${i}月</option>`);
      } else {
        $("#endMonth").append(`<option value="${i}">${i}月</option>`);
      }
    }

    $("#comment").text(`${memo}`);

    for(var i=0; i<images.length; i++) {
      $("#imageList").append(`<img src="${images[i]}" id="postImg">`);
    }

    fadeOut();
  });

   $('#selectArea').change(function(){
      const select = $('#selectArea').val();
      $("#selectDetailArea").empty();
      for(var i=0; i<areaDetailList[select].length; i++) {
        $("#selectDetailArea").append(`<option value="${i}">${areaDetailList[select][i]}</option>`);
      }
    });

  
  $("#update").click(async function() {
    fadeIn();
    var area = $('[name=area] option:selected').text();
    var areaDetail = $('[name=detailArea] option:selected').text();
    var industry = $('[name=industry] option:selected').text();
    var industryDetail = $("#occupation_detail").val();
    var company = $('[name=company] option:selected').text();
    var periodFlag = $("input[name=period_check]").prop("checked");
    var startYear = $('[name=startYear] option:selected').text();
    var startMonth = $('[name=startMonth] option:selected').text();
    var endYear = $('[name=endYear] option:selected').text();
    var endMonth = $('[name=endMonth] option:selected').text();
    var comment = $("#comment").val();
    await db.collection('post').doc(docId).update({
      'industry': industry,
      'industryDetail': industryDetail,
      'company': company,
      'area': area,
      'areaDetail': areaDetail,
      'memo': comment,
      'startYear': startYear,
      'endYear': endYear,
      'startMonth': startMonth,
      'endMonth': endMonth,
      'periodFlag': periodFlag,
    }).then(() => {
      window.location.href = `work_detail.html?docId=${docId}&uid=${uid}`;
    })
  });
}