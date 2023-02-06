(function () {
  // アイコンクリックアクション
  $(document).on('click', ".icon", function() {
    window.location.href = `index.html`;
  });
  firebase.auth().onAuthStateChanged((user) => {

    // ログイン時のメニュー
    $(".hamburger-list").empty();
    if (user) {
      const uid = user.uid;
      $(".hamburger-list").append(
        `<ul>
          <li id="close"><i class="fa-solid fa-xmark fa-2xl"></i></li>
          <li id="menu_li">
            <form action="/top" method="POST">
              <h5 class="login menu_btn"><i class="fa-solid fa-house"></i><input type="submit" value="Top">
            </form>
          </li>
          <li id="menu_li">
            <form action="/profile" method="POST">
              <h5 class="profile menu_btn"><i class="fa-solid fa-user"></i><input type="submit" value="プロフィール">
            </form>
          </li>
        
          <li id="menu_li">
            <form action="/signUp" method="POST">
              <h5 class="signUp menu_btn"><i class="fa-solid fa-user-plus"></i><input type="submit" value="新規登録">
            </form>
          </li>
          <li id="menu_li">
            <form action="/test" method="POST">
              <h5 class="test menu_btn"><i class="fa-solid fa-file-lines"></i><input type="submit" value="診断テスト">
            </form>
          </li>
          <li id="menu_li">
            <form action="/inquiry" method="POST">
              <h5 class="inquiry menu_btn"><i class="fa-solid fa-circle-question"></i><input type="submit" value="お問い合わせ">
            </form>
          </li>
          <li id="menu_li">
            <form action="/logout" method="POST">
              <h5 class="logout menu_btn"><i class="fa-solid fa-right-from-bracket"></i><input type="submit" value="ログアウト">
            </form>
          </li>
      </ul>`
      );
      // プロフィール
      $(document).on('click', '.profile', function () {
        window.location.href = `profile.html?uid=${uid}`;
      });

      // アルバム
      $(document).on('click', '.album', function () {
        window.location.href = `album.html?uid=${uid}`;
      });

      // お問い合わせ
      $(document).on('click', '.inquiry', function () {
        window.location.href = `inquiry.html?uid=${uid}`;
      });
    } else {
      // 非ログイン時のメニュー
      $(".hamburger-list").append(
        `<ul>
          <li id="close"><i class="fa-solid fa-xmark fa-2xl"></i></li>
          <li id="menu_li">
            <form action="/top" method="POST">
              <h5 class="login menu_btn"><i class="fa-solid fa-house"></i><input type="submit" value="Top">
            </form>
          </li>
          <li id="menu_li">
            <form action="/login" method="POST">
              <h5 class="login menu_btn"><i class="fa-solid fa-right-to-bracket"></i><input type="submit" value="ログイン">
            </form>
          </li>
          <li id="menu_li">
            <form action="/signUp" method="POST">
              <h5 class="signUp menu_btn"><i class="fa-solid fa-user-plus"></i><input type="submit" value="新規登録">
            </form>
          </li>
          <li id="menu_li">
            <form action="/test" method="POST">
              <h5 class="test menu_btn"><i class="fa-solid fa-file-lines"></i><input type="submit" value="診断テスト">
            </form>
          </li>
          <li id="menu_li">
            <form action="/inquiry" method="POST">
              <h5 class="inquiry menu_btn"><i class="fa-solid fa-circle-question"></i><input type="submit" value="お問い合わせ">
            </form>
          </li>
        </ul>`
      );
      // お問い合わせ
      $(document).on('click', '.inquiry', function () {
        window.location.href = `inquiry.html?uid=''`;
      });
    }

    // メニューリスト表示
    $(document).on('click',".menu-btn, .hamburger-menu", function () {
      $('.hamburger-list').offset({ left: 0 });
    });

    // メニューリスト非表示
    $(document).on('click',".fa-xmark , .hamburger-list", function () {
      $('.hamburger-list').offset({ left: -2000 });
    });

    // Topページへ
    $(document).on('click',".top", function () {
      window.location.href = 'index.html';
    });

    // ログイン
    // $(document).on('click', '.login', function () {
    //   window.location.href = '/login.html';
    // });

    // 新規登録
    $(document).on('click', '.sign_up', function () {
      window.location.href = 'sign_up.html';
    });

    // テスト
    $(document).on('click', '.test', function () {
      window.location.href = 'test.html';
    });

    // ログアウト
    $(document).on('click', '.logout', function () {
      firebase.auth().signOut();
      window.location.href = 'index.html';
    });
  });
}());