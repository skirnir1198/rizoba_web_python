{
  const db = firebase.firestore();

   // URLSearchParamsオブジェクトを取得
   const url = new URL(window.location.href);
   const params = url.searchParams;
   const docId = params.get("docId");
   const uid = params.get("uid");
   const type = params.get("type");
   var date = new Date();

   $(".report_post").click(async function() {
    const text = $(this).text();
    await db.collection('report').doc().set({
      'contents': text,
      'createdAt': date,
      'docId': docId,
      'postType': type,
      'reportUser': uid,
    }).then(() => {
      window.location.href = 'index.html';
    });
   });

}