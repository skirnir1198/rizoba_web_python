{
  const db = firebase.firestore();
  var date = new Date();
  var nowYear = date.getFullYear();
  var nowMonth = date.getMonth() + 1;
  // URLSearchParamsオブジェクトを取得
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const uid = params.get("uid");
  var sex;
  var uploadImages =[];

  db.collection("user").doc(uid).get().then((doc)=>{
    sex = doc.get('sex');
  }).then(()=>{
    //派遣会社 ------------------------------------------------
    for(var i=0; i<companyList.length; i++) {
      $("#selectCompany").append(`<option value="0">${companyList[i]}</option>`);
    }

    $(`#jobOffer`).raty({
      score : 1,
      number : 5,
    });

    $(`#hourlyWage`).raty({
      score : 1,
      number : 5,
    });

    $(`#support`).raty({
      score : 1,
      number : 5,
    });

    
  }).then(()=>{
    fadeOut();
  });

  $("#add_btn").click(async function() {
    fadeIn();
    var company = $('[name=company] option:selected').text();
    var jobOffer = $(`#jobOffer`).data("raty").score();
    var hourlyWage = $(`#hourlyWage`).data("raty").score();
    var support = $(`#support`).data("raty").score();
    var comment = $("#comment").val();
    const id = db.collection('companyReview').doc().id;

    await db.collection('companyReview').doc(id).set({
      'company': company,
      'docId': id,
      'uid': uid,
      'watchCount': '0',
      'goodCount': [],
      'jobOffer': jobOffer,
      'hourlyWage': hourlyWage,
      'support': support,
      'comment': comment,
      'createdAt': date,
    }).then(() => {
      window.location.href = 'index.html';
    });
  });
}