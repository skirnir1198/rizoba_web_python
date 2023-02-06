{
     // html読み込み時に実行
     $(document).ready(function(){
        $.ajaxSetup({cache:false});
        $("#header").load("./header.html");
        $.ajaxSetup({cache:false});
        $("#footer").load("./footer.html");
    });
    
    const db = firebase.firestore();
    const company_test = [
      '性別は女性ですか？',
      '年齢は40代以上ですか？',
      '今までリゾバをした事がある',
      'リゾバの目的はお金をガッツリ稼ぐこと',
      '1ヶ月以内の短期求人を探している',
      '友達同士またはカップルで応募したい',
      '海外留学,ワーホリに行こうと考えている',
      '沖縄または北海道で働きたい',
      '冬はスキー場で働きたい'
    ];

    const company_features = [
      // ダイブ
      ['スタッフのサポート力No. 1','求人数が業界Topクラス','留学サポートが手厚い'],
      // アルファリゾート
      ['旅館リゾバの時給の高さと求人数が業界トップ','温泉地での求人が多数ある','留学生応援プランを提供している'],
      // グッドマン
      ['高時給の求人数が業界No.1','最高時給保証制度','リピーター制度'],
      // ヒューマニック
      ['求人数が業界No.1','短期リゾバの求人も豊富','友達同士歓迎の求人が多い'],
      // ワクトリ
      ['DMM英会話が無料で利用できる','求人数が業界Topクラス','高時給の求人数が豊富'],
    ];
    const features_details = [
      // ダイブ
      [`ダイブは実際の口コミでもスタッフの対応が素早く丁寧と好評です。
      就業中もこまめに連絡をしてくださり、初めてのリゾートバイトにはおすすめの会社です。`,
      `<p>全求人数(2023年1月時点)</p>
      <table>
      <tr><td>ダイブ</td> <td>2660件</td></tr>
      <tr><td>ヒューマニック</td> <td>2468件</td></tr>
      <tr><td>グッドマンサービス</td> <td>1745件</td></tr>
      <tr><td>アルファリゾート</td> <td>1,743件</td></tr>
      </table>`,
      `スマ留andリゾートバイトというスマ留×Diveのオリジナルプランがあり、
      貯金がない状態でリゾートバイトを行い、生活費を抑えつつ纏まったお金を稼ぎ、留学の費用が溜まった時点で留学をするというプランです。
      留学も考えているという方におすすめのサービスです。`
      ],
      // アルファリゾート
      [`特に仲居の仕事は未経験者でも時給1,230円、さらに経験者は時給1,350円が保証されています。`,
      `アルファリゾートの求人は、約6割が温泉地です。`,
      `語学留学したい人を応援する留学生応援プランを提供しています。オンライン英会話レッスンが、24時間365日いつでも無料で受講できます。`
      ],
      // グッドマン
      [`<p>時給1,300円以上の求人数(2022年12月時点)</p>
      <table>
      <tr><td>グッドマンサービス</td> <td>991件</td></tr>
      <tr><td>ヒューマニック</td> <td>798件</td></tr>
      <tr><td>アルファリゾート</td> <td>505件</td></tr>
      <tr><td>ダイブ</td> <td>406件</td></tr>
      </table>`,
      `もしも同じホテルや旅館で他社さんの方が時給が高い場合、担当社員に連絡すれば時給を他社よりも高く設定してくれる制度です。`,
      `グッドマンサービスを利用したことがある方は、2度目からはリピーター時給が適応されます。<br>
      基本的には時給が50円UP！<br>
      時給：1,450円⇨1,500円<br>
      時給：1,500円→1,550円`
      ],
      // ヒューマニック
      [`<p>全求人数(2023年1月時点)</p>
      <table>
      <tr><td>ヒューマニック</td> <td>2468件</td></tr>
      <tr><td>グッドマンサービス</td> <td>1745件</td></tr>
      <tr><td>アルファリゾート</td> <td>1,743件</td></tr>
      <tr><td>ダイブ</td> <td>2660件</td></tr>
      </table>`,
      `<p>短期OKの求人数(2023年1月時点)</p>
      <table>
      <tr><td>ヒューマニック</td> <td>924件</td></tr>
      <tr><td>ダイブ</td> <td>499件</td></tr>
      <tr><td>グッドマンサービス</td> <td>766件</td></tr>
      <tr><td>アルファリゾート</td> <td>76件</td></tr>
      </table>
      `,
      `<p>友達同士歓迎の求人数(2023年1月時点)</p>
      <table>
      <tr><td>ヒューマニック</td> <td>1551件</td></tr>
      <tr><td>ダイブ</td> <td>1848件</td></tr>
      <tr><td>グッドマンサービス</td> <td>1127件</td></tr>
      <tr><td>アルファリゾート</td> <td>874件</td></tr>
      </table>`
      ],
      // ワクトリ
      [`3ヶ月以上の契約で月額6.480円の「スタンダードプラン」を利用可能に！<br>
      (毎日25分のプラン)`,
      `<table>
      <p>全求人数(2023年1月時点)</p>
      <tr><td>ワクトリ</td> <td>1975件</td></tr>
      <tr><td>ヒューマニック</td> <td>2468件</td></tr>
      <tr><td>グッドマンサービス</td> <td>1745件</td></tr>
      <tr><td>アルファリゾート</td> <td>1,743件</td></tr>
      <tr><td>ダイブ</td> <td>2660件</td></tr>
      </table>`,
      `時給の平均が約1,150円前後と、非常に高水準です。`
      ],
    ];

    const recommend_reason = [
      'リゾバが初めての',
      '女性でガッツリ稼ぎたい',
      'ガッツリ稼ぎたい',
      '友達同士またはカップルで応募したい',
      'ガッツリ稼ぎたい',
    ];

    var q_count = 1;
    var q_array = [];
    var q_num = 0;
    // dive, アルファ, グッドマン, ヒューマニック, ワクトリ
    var dive = 0;
    var alpha = 0;
    var goodman = 0;
    var humanic = 0;
    var wakutori = 0;
    var affiliate;

    // html読み込み時に実行
    $(document).ready(function(){
         // PC版
    if($(window).width() > 960) {
        affiliate  = [
          // Dive
          `<a href="https://px.a8.net/svt/ejp?a8mat=3SZWNV+A4YQLU+4Z92+5ZMCH" rel="nofollow" target="_blank">
          <img border="0" width="320" height="50" alt="" src="https://www28.a8.net/svt/bgt?aid=230103067613&wid=001&eno=01&mid=s00000023231001006000&mc=1"></a>
          <img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3SZWNV+A4YQLU+4Z92+5ZMCH" alt="">`,
          // アルファ
          `<a href="https://px.a8.net/svt/ejp?a8mat=3SZWNV+A9Q7G2+39C6+661TT" rel="nofollow" target="_blank" rel="noopener noreferrer">
          <img border="0" width="468" height="60" alt="" src="https://www24.a8.net/svt/bgt?aid=230103067621&wid=001&eno=01&mid=s00000015207001036000&mc=1"></a>
          <img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3SZWNV+A9Q7G2+39C6+661TT" alt="">`,
          // グッドマン
          `<a href="https://www.rizoba.com/" rel="nofollow" target="_blank" rel="noopener noreferrer">グッドマンサービス</a>`,
          // ヒューマニック
          `<a href="https://px.a8.net/svt/ejp?a8mat=3SZWNV+A6R1F6+42GS+60H7L" rel="nofollow" target="_blank" rel="noopener noreferrer">
          <img border="0" width="468" height="60" alt="" src="https://www27.a8.net/svt/bgt?aid=230103067616&wid=001&eno=01&mid=s00000018982001010000&mc=1"></a>
          <img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3SZWNV+A6R1F6+42GS+60H7L" alt="">`,
          // ワクトリ
          `<a href="https://work-trip.jp/" rel="nofollow" target="_blank" rel="noopener noreferrer">ワクトリ</a>`,
          ,
        ];
      } else {
        affiliate = [
          // Dive
          `<a href="https://px.a8.net/svt/ejp?a8mat=3SZWNV+A4YQLU+4Z92+609HT" rel="nofollow" target="_blank">
          <img border="0" width="240" height="200" alt="" src="https://www26.a8.net/svt/bgt?aid=230103067613&wid=001&eno=01&mid=s00000023231001009000&mc=1"></a>
          <img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3SZWNV+A4YQLU+4Z92+609HT" alt="">`,
          // アルファ
          `<a href="https://px.a8.net/svt/ejp?a8mat=3SZWNV+A9Q7G2+39C6+66OZ5" rel="nofollow" target="_blank" rel="noopener noreferrer">
          <img border="0" width="240" height="200" alt="" src="https://www26.a8.net/svt/bgt?aid=230103067621&wid=001&eno=01&mid=s00000015207001039000&mc=1"></a>
          <img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=3SZWNV+A9Q7G2+39C6+66OZ5" alt="">`,
          // グッドマン
          `<a href="https://www.rizoba.com/" rel="nofollow" target="_blank" rel="noopener noreferrer">グッドマンサービス</a>`,
          // ヒューマニック
          `<a href="https://px.a8.net/svt/ejp?a8mat=3SZWNV+A6R1F6+42GS+60WN5" rel="nofollow" target="_blank" rel="noopener noreferrer">
          <img border="0" width="240" height="200" alt="" src="https://www28.a8.net/svt/bgt?aid=230103067616&wid=001&eno=01&mid=s00000018982001012000&mc=1"></a>
          <img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3SZWNV+A6R1F6+42GS+60WN5" alt="">`,
          // ワクトリ
          `<a href="https://work-trip.jp/" rel="nofollow" target="_blank" rel="noopener noreferrer">ワクトリ</a>`,
        ]
      }
    fadeOut();
    });
   
    // 診断テスト -------------------------------------------------------------------------------------
    // テスト開始
    $(document).on('click', '#company_test', async function() {
      fadeIn();
      const data = await db.collection('config').doc('5flwSgo6T0Bd7M9vV7ho').get();
      db.collection('config').doc('5flwSgo6T0Bd7M9vV7ho').update({
        'test_start': data.get('test_start')+1,
      });
      $("#content").empty();
      $("#content").append(`
      <div id="box">
        <div id="q_title" style="color: #6091d3;">Q${q_count}.${company_test[q_num]}</div>
        <div id="btn_content"><div id="ans_btn" data-id='0'>はい</div><div id="ans_btn" data-id='1'>いいえ</div></div>
      </div>
      `);
      fadeOut();
    });

    // テスト質問
    $(document).on('click', '#ans_btn', async function() {
      var id =  Number($(this).data('id'));
      q_array.push(id);
      // テスト終了
      if(q_num == 8){
        const data = await db.collection('config').doc('5flwSgo6T0Bd7M9vV7ho').get();
        db.collection('config').doc('5flwSgo6T0Bd7M9vV7ho').update({
          'test_finish': data.get('test_finish')+1,
        });
        $("#content").empty();
        $("#content").append(`
        <div id="content">
          <div id="loading">
            <div class="kvArea" id="loading_box">
              <div class="img_box"><img src="image/Spinner-3.gif" alt="" class="fadeUp"></div>
              <div id="diagnose">診断中</div>
            </div>
          </div>
        </div>
        `);
        // dive, アルファ, グッドマン, ヒューマニック, ワクトリ
        // 性別は女性ですか？
        if(q_array[0] == 0) {
          alpha+=3;
        }
        // 年齢は40代以上ですか？
        if(q_array[1] == 0) {
          humanic++;
          goodman++;
          }
        // 今までリゾバをした事がある
        if(q_array[2] == 1) {
          dive+=3;
        } 
        // お金をガッツリ稼ぎたいですか？
        if(q_array[3] == 0) {
          goodman+= 3;
          humanic+=2;
          wakutori++;
        }
        // 1ヶ月以内の短期求人を探している
        if(q_array[4] == 0) {
          humanic+=2;
          wakutori++;
          goodman++;
        // 長期求人を探している
        } else {
          alpha++;
          wakutori++;
        }
        
        // 友達同士またはカップルで応募したい
        if(q_array[5] == 0) {
          humanic+=2;
          goodman++;
        }
        // 海外留学を考えている
        if(q_array[6] == 0) {
          alpha++;
          humanic++;
          dive++;
        }
        // 沖縄または北海道で働きたい
        if(q_array[7] == 0) {
          humanic++;
          goodman++;
          alpha++;
        }
        // 冬はスキー場で働きたいと思っている
        if(q_array[8] == 0) {
          humanic++;
          goodman++;
        }

        // dive, アルファ, グッドマン, ヒューマニック, ワクトリ
        var q_company = [dive,alpha,goodman,humanic,wakutori];
        var company_name = ['Dive', 'アルファリゾート', 'グッドマンサービス', 'ヒューマニック', 'ワクトリ'];
        const max = Math.max.apply(null, q_company);
        const ans_num = q_company.indexOf(max);
        const ans = company_name[ans_num];
        const affili = affiliate[ans_num];
        var date = new Date();
        // await db.collection('companyTest').add({
        //   'ans': q_array,
        //   'company_point': q_company,
        //   'company_name': ans,
        //   'createdAt': date,
        // });
        setTimeout(function(){
        $("#title").text('');
        $("#content").empty();
        $("#content").append(`
          <div id="box_ans">
            <h5 id="q_title">${recommend_reason[ans_num]}<br>あなたにおすすめの派遣会社は</h5>
            <div id="q_ans"><img src="image/豆電球のアイコン素材 その2.svg"><h5>${ans}</h5></div>
            <h4 id="company_name">${ans}の特徴</h4>
            <div id="company_features">
              <h5 id="company_feature">1. ${company_features[ans_num][0]}</h5>
              <h5 id="company_feature">2. ${company_features[ans_num][1]}</h5>
              <h5 id="company_feature">3. ${company_features[ans_num][2]}</h5>
            </div>
            <div id="features_details">
            <h3 id="company_feature">1. ${company_features[ans_num][0]}</h3>
            <h5 id="features_detail">${features_details[ans_num][0]}</h5>
            <h3 id="company_feature">2. ${company_features[ans_num][1]}</h3>
            <h5 id="features_detail"> ${features_details[ans_num][1]}</h5>
            <h3 id="company_feature">3. ${company_features[ans_num][2]}</h3>
            <h5 id="features_detail"> ${features_details[ans_num][2]}</h5>
          </div>
            <div id="return_test">もう一度診断してみる</div>
            ${affili}
          </div>
        `);
        },2000);
        q_count = 1;
        q_array = [];
        q_num = 0;
        dive = 0;
        alpha = 0;
        goodman = 0;
        humanic = 0;
        wakutori = 0;
        q_company = [0,0,0,0,0];
        return;
      }
    q_count++;
    q_num++;
    $("#content").empty();
    $("#content").append(`
    <div id="box">
        <div id="q_title" style="color: #6091d3;">Q${q_count}.${company_test[q_num]}</div>
        <div id="btn_content"><div id="ans_btn" data-id='0'>はい</div><div id="ans_btn" data-id='1'>いいえ</div></div>
    </div>
    `);
  });

    // もう一度テスト
    $(document).on('click','#return_test', async function () {
    fadeIn();
    const data = await db.collection('config').doc('5flwSgo6T0Bd7M9vV7ho').get();
    db.collection('config').doc('5flwSgo6T0Bd7M9vV7ho').update({
      'test_return': data.get('test_return')+1,
    });
    $("#title").text('あなたにおすすめの派遣会社は？？');
    $("#content").empty();
    $("#content").append(`
    <div id="box">
        <div id="q_title" style="color: #6091d3;">Q${q_count}.${company_test[q_num]}</div>
        <div id="btn_content"><div id="ans_btn" data-id='0'>はい</div><div id="ans_btn" data-id='1'>いいえ</div></div>
    </div>
    `);
    fadeOut();
    }); 

    $(document).on('click','a', async function () {
      const data = await db.collection('config').doc('5flwSgo6T0Bd7M9vV7ho').get();
      db.collection('config').doc('5flwSgo6T0Bd7M9vV7ho').update({
        'link_click': data.get('link_click')+1,
      });
    });
  }