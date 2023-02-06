{
  // メールログイン
  $('#sign_in').on('click', function(){
    $("#error").text();
    $("#loading").css('display', 'block');
    let email = document.getElementById('email').value;
    let password = document.getElementById('pass').value;    
    firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
      window.location.href = 'index.html';
    }).catch(function(error) {
      var errorMessage = error.message;
      if(errorMessage == 'The email address is badly formatted.') {
        $("#error").text('*メールアドレスが正しくありません');
      } else if(errorMessage == 'The password is invalid or the user does not have a password.') {
        $("#error").text('*パスワードが正しくありません');
      }
      console.log(errorMessage);
      $("#loading").css('display', 'none');
    });
  });

  // Googleログイン
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        return true;
      },
    },
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    tosUrl: 'sample01.html',
  };

  ui.start('#google_btn', uiConfig);

  firebase.auth().onAuthStateChanged(user => {
    user = user;
  });

  // appleログイン
   $("#appleid-signin").on('click', async function(){
    var provider = new firebase.auth.OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // The signed-in user info.
      var user = result.user;

      // You can also get the Apple OAuth Access and ID Tokens.
      var accessToken = credential.accessToken;
      var idToken = credential.idToken;

      // ...
      console.log(user);
      window.location.href = 'index.html';
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      // ...
      console.log(error);
    });
   });
}