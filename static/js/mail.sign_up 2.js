{
  window.onload = function () {
    var el = document.getElementById("sign_up");
    el.onclick = buttonClick;
  }

  async function buttonClick(){

  }
}

$("#sign_up").on('click', async function() {
  let email = document.getElementById('email').value;
  let password = document.getElementById('pass').value;
  let userName = document.getElementById('userName').value;
  try {
  // 登録の確認
  const providers = await firebase.auth().fetchSignInMethodsForEmail(email);

  if (providers.findIndex(p => p === firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) !== -1) {
    $("#error").text('*このメールアドレスはすでに登録されているようです');
    return '';
  } else if(userName.length == 0) {
    $("#error").text('*ユーザー名を入力してください');
    return '';
  }


  // アカウント作成
  await firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
    var now = new Date();
    firebase.firestore().collection("user").doc(userCredential.user.uid).set({
      'blockThread': [],
      'blockUser': [],
      'comment': '',
      'createdAt': now,
      'day': '0',
      'month': '0',
      'year': '1979',
      'email': email,
      'favoritePosts': [],
      'ios_current_version': '1.4.0',
      'profile': '',
      'sex': '0',
      'token': '',
      'uid': userCredential.user.uid,
      'unreadLists': [],
      'userName': userName,
    }).then((doc) => {
      window.location.href = 'index.html';
    }).catch((error) => {
    console.log(error);
  });
  });

  } catch (e) {
  // e.code で処理分ける
  console.error(e.message);
  var errorMessage = e.message;
  if(errorMessage == 'The email address is badly formatted.') {
    $("#error").text('*メールアドレスが正しくありません');
  } else if(errorMessage == 'The password is invalid or the user does not have a password.') {
    $("#error").text('*パスワードが正しくありません');
  }
  }
});