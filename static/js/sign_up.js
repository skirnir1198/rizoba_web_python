{
	$(document).ready(
		async function(){
		fadeOut();
		$.ajaxSetup({cache:false});
		$("#header").load("./header.html");
		$.ajaxSetup({cache:false});
		$("#footer").load("./footer.html");
		}
	);
	
	const db = firebase.firestore();
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

	firebase.auth().onAuthStateChanged(user => {});

	// 本来はCSRF対策用の文字列を準備してください
	const rand = 'ST' + Math.ceil( Math.random() * 100000 );

	// ログイン処理
	AppleID.auth.init({
				clientId : "net.miku3.id.apple.service",
					scope : "email",
			redirectURI: "https://miku3.net/appleid/callback",
					state : rand
	});

}
