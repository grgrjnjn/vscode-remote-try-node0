// あなたは優秀なプログラマです。
// 私はLinux上で、node.jsとselenium（ヘッドレスモード）を用いたプログラミングをしています。

// サーバーローカルファイルの解析だがselenium（ヘッドレスモード）を使います。

// 「HTML（抜粋）」が１投稿分のHTMLです。
// XPathを用いず、CSSセレクタを用いてこれを分析するコードを生成してください。



// ###HTML（抜粋）
// <font size="4">
// 2024-09-12 13:06<br>
// 449967<span id="b449967"></span>[<a href="mailto:shemeil105@gmail.com">もえ</a>] [<a href="https://kanajo.com/public/comment/edit/?id=9306738">編集</a>][<a href="">通報</a>]<font color="#FFC0CB">new!</font><br>
// <a href="https://kanajo.com/public/thread/img/?id=9306738&amp;type=comment&amp;no=1"><img width="48px" height="64px" src="http://kanajo.com/public/assets/img/bbs/00000001/thumb_bec57ec7ca8f7a5be2b819fa62b59927.jpg?1726114008" alt=""></a>&nbsp;<a href="https://kanajo.com/public/thread/img/?id=9306738&amp;type=comment&amp;no=2"><img width="48px" height="64px" src="http://kanajo.com/public/assets/img/bbs/00000001/thumb_c6ee1e9e717d8738c1b7572d14de29d0.jpg?1726114008" alt=""></a>&nbsp;<a href="https://kanajo.com/public/thread/img/?id=9306738&amp;type=comment&amp;no=3"><img width="48px" height="64px" src="http://kanajo.com/public/assets/img/bbs/00000001/thumb_f30fd5e791b42856d56d3c592209d1c1.jpg?1726114008" alt=""></a>&nbsp;<br>
// これから秋葉原駅近くでフェラかエッチで（タダではないです）。だいたいの背丈年齢に秋葉原駅周辺に何時頃なるかを必ず記載してください。後日今度逆アナは不可NG。駅から少し歩いた場所にひと気少ない多目的トイレと駅の改札からすぐ歩いた近くにホテルかレンタルルームがあります。車の方なら車内も可。ゴムローションあります。写真詐欺業者釣り募集ではないです。見た目容姿特徴は記載してる一切加工なしのノーマルカメラ直自撮り写真とプロフ通りです。163cm 51kg ホル乳Fカップ　B92w58H87<br>
// <br>
// 性別 ：男の娘<br> 
// 年齢 ：18～24歳<br>
// 地域 ：秋葉原<br>
// <font color="#FF69B4">即ｴｯﾁ希望</font><br><hr align="center" color="#FFC0CB" size="2" width="100%"><center><a href="https://deaikeirank.net/"><font size="4">マジでヤレる！<br>出会い系攻略の秘密</font></a> </center><hr align="center" color="#FFC0CB" size="2" width="100%">


const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;

async function parsePost(html) {
  let driver;

  try {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // HTMLをローカルファイルとして保存
    await fs.writeFile('temp.html', html);
    await driver.get(`file://${process.cwd()}/temp.html`);

    // 投稿データの抽出
    const postData = {
      datetime: await driver.findElement(By.css('font[size="4"]')).getText(),
      postId: await driver.findElement(By.css('span[id^="b"]')).getAttribute('id'),
      name: await driver.findElement(By.css('a[href^="mailto:"]')).getText(),
      email: await driver.findElement(By.css('a[href^="mailto:"]')).getAttribute('href').then(href => href.replace('mailto:', '')),
      images: await driver.findElements(By.css('a[href^="https://kanajo.com/public/thread/img/"] img')).then(elements => 
        Promise.all(elements.map(el => el.getAttribute('src')))
      ),
      message: await driver.executeScript(`
        return document.querySelector('font[size="4"]').innerText.split('\\n').slice(2, -4).join('\\n').trim();
      `),
      性別: await driver.findElement(By.css('font[size="4"]')).getText().then(text => {
        const match = text.match(/性別\s*：\s*(.+)/);
        return match ? match[1].trim() : null;
      }),
      年齢: await driver.findElement(By.css('font[size="4"]')).getText().then(text => {
        const match = text.match(/年齢\s*：\s*(.+)/);
        return match ? match[1].trim() : null;
      }),
      地域: await driver.findElement(By.css('font[size="4"]')).getText().then(text => {
        const match = text.match(/地域\s*：\s*(.+)/);
        return match ? match[1].trim() : null;
      }),
      希望: await driver.findElement(By.css('font[color="#FF69B4"]')).getText()
    };

    console.log(JSON.stringify(postData, null, 2));

    // 一時ファイルの削除
    await fs.unlink('temp.html');

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// HTMLデータ
const htmlData = `
<font size="4">
2024-09-12 13:06<br>
449967<span id="b449967"></span>[<a href="mailto:shemeil105@gmail.com">もえ</a>] [<a href="https://kanajo.com/public/comment/edit/?id=9306738">編集</a>][<a href="">通報</a>]<font color="#FFC0CB">new!</font><br>
<a href="https://kanajo.com/public/thread/img/?id=9306738&amp;type=comment&amp;no=1"><img width="48px" height="64px" src="http://kanajo.com/public/assets/img/bbs/00000001/thumb_bec57ec7ca8f7a5be2b819fa62b59927.jpg?1726114008" alt=""></a>&nbsp;<a href="https://kanajo.com/public/thread/img/?id=9306738&amp;type=comment&amp;no=2"><img width="48px" height="64px" src="http://kanajo.com/public/assets/img/bbs/00000001/thumb_c6ee1e9e717d8738c1b7572d14de29d0.jpg?1726114008" alt=""></a>&nbsp;<a href="https://kanajo.com/public/thread/img/?id=9306738&amp;type=comment&amp;no=3"><img width="48px" height="64px" src="http://kanajo.com/public/assets/img/bbs/00000001/thumb_f30fd5e791b42856d56d3c592209d1c1.jpg?1726114008" alt=""></a>&nbsp;<br>
これから秋葉原駅近くでフェラかエッチで（タダではないです）。だいたいの背丈年齢に秋葉原駅周辺に何時頃なるかを必ず記載してください。後日今度逆アナは不可NG。駅から少し歩いた場所にひと気少ない多目的トイレと駅の改札からすぐ歩いた近くにホテルかレンタルルームがあります。車の方なら車内も可。ゴムローションあります。写真詐欺業者釣り募集ではないです。見た目容姿特徴は記載してる一切加工なしのノーマルカメラ直自撮り写真とプロフ通りです。163cm 51kg ホル乳Fカップ　B92w58H87<br>
<br>
性別 ：男の娘<br> 
年齢 ：18～24歳<br>
地域 ：秋葉原<br>
<font color="#FF69B4">即ｴｯﾁ希望</font><br><hr align="center" color="#FFC0CB" size="2" width="100%"><center><a href="https://deaikeirank.net/"><font size="4">マジでヤレる！<br>出会い系攻略の秘密</font></a> </center><hr align="center" color="#FFC0CB" size="2" width="100%">
`;

parsePost(htmlData);
