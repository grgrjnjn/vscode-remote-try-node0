// あなたは優秀なプログラマです。
// 私はLinux上で、node.jsとselenium（ヘッドレスモード）を用いたプログラミングをしています。

// サーバーローカルファイルの解析だがselenium（ヘッドレスモード）を使います。
// XPathを用いず、CSSセレクタを用います。

// サーバーローカルにあるファイル（掲示板HTML）を読み込む→記事ごとに分解→項目に分解→JSONとして保存
// というプログラムを作っってください。

// 記事ごとに分解は、下記「掲示板HTMLから記事を抽出するコード」を忠実に引用。
// 項目に分解は、下記「記事HTMLから項目に分解するコード」を忠実に引用。






// ###掲示板HTMLから記事を抽出するコード
// const fs = require('fs').promises;
// const path = require('path');

// async function splitPosts(htmlFileName) {
//   try {
//     // HTMLファイルを読み込む
//     const htmlPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'html', htmlFileName);
//     const html = await fs.readFile(htmlPath, 'utf-8');

//     // 正規表現を使用して記事を分割
//     const postRegex = /<hr align="center" color="#FFC0CB" size="2" width="100%">\s*(<font size="4">[\s\S]*?)<center>/g;
//     const posts = [];
//     let match;

//     while ((match = postRegex.exec(html)) !== null) {
//       posts.push(match[1].trim());
//     }

//     // 分割された記事を表示（デバッグ用）
//     // posts.forEach((post, index) => {
//       console.log(`記事 ${index + 1}:`);
//       console.log(post);
//       console.log('-------------------');
//     });

//     // 結果をJSONファイルとして保存
//     const jsonFileName = htmlFileName.replace('.html', '.json');
//     const jsonPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'json', jsonFileName);
//     await fs.writeFile(jsonPath, JSON.stringify(posts, null, 2));

//     console.log(`記事が正常に分割され、${jsonPath} に保存されました。`);

//   } catch (error) {
//     console.error('エラーが発生しました:', error);
//   }
// }

// // HTMLファイル名を指定して実行
// const htmlFileName = 'example.html'; // 実際のファイル名に置き換えてください
// splitPosts(htmlFileName);

// ###記事HTMLから項目に分解するコード
// const { Builder, By } = require('selenium-webdriver');
// const chrome = require('selenium-webdriver/chrome');
// const fs = require('fs').promises;

// async function parsePost(html) {
//   let driver;

//   try {
//     const options = new chrome.Options();
//     options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

//     driver = await new Builder()
//       .forBrowser('chrome')
//       .setChromeOptions(options)
//       .build();

//     // HTMLをローカルファイルとして保存
//     await fs.writeFile('temp.html', html);
//     await driver.get(`file://${process.cwd()}/temp.html`);

//     // 投稿データの抽出
//     const postData = {
//       datetime: await driver.findElement(By.css('font[size="4"]')).getText(),
//       postId: await driver.findElement(By.css('span[id^="b"]')).getAttribute('id'),
//       name: await driver.findElement(By.css('a[href^="mailto:"]')).getText(),
//       email: await driver.findElement(By.css('a[href^="mailto:"]')).getAttribute('href').then(href => href.replace('mailto:', '')),
//       images: await driver.findElements(By.css('a[href^="https://kanajo.com/public/thread/img/"] img')).then(elements => 
//         Promise.all(elements.map(el => el.getAttribute('src')))
//       ),
//       message: await driver.executeScript(`
//         return document.querySelector('font[size="4"]').innerText.split('\\n').slice(2, -4).join('\\n').trim();
//       `),
//       性別: await driver.findElement(By.css('font[size="4"]')).getText().then(text => {
//         const match = text.match(/性別\s*：\s*(.+)/);
//         return match ? match[1].trim() : null;
//       }),
//       年齢: await driver.findElement(By.css('font[size="4"]')).getText().then(text => {
//         const match = text.match(/年齢\s*：\s*(.+)/);
//         return match ? match[1].trim() : null;
//       }),
//       地域: await driver.findElement(By.css('font[size="4"]')).getText().then(text => {
//         const match = text.match(/地域\s*：\s*(.+)/);
//         return match ? match[1].trim() : null;
//       }),
//       希望: await driver.findElement(By.css('font[color="#FF69B4"]')).getText()
//     };

//     console.log(JSON.stringify(postData, null, 2));

//     // 一時ファイルの削除
//     await fs.unlink('temp.html');

//   } catch (error) {
//     console.error('エラーが発生しました:', error);
//   } finally {
//     if (driver) {
//       await driver.quit();
//     }
//   }
// }

// // HTMLデータ
// const htmlData = `
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
// `;

// parsePost(htmlData);






const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;
const path = require('path');

async function processHtmlFile(htmlFileName) {
  let driver;

  try {
    // HTMLファイルを読み込む
    const htmlPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'html', htmlFileName);
    const html = await fs.readFile(htmlPath, 'utf-8');

    // 正規表現を使用して記事を分割
    const postRegex = /<hr align="center" color="#FFC0CB" size="2" width="100%">\s*(<font size="4">[\s\S]*?)<center>/g;
    const posts = [];
    let match;

    while ((match = postRegex.exec(html)) !== null) {
      posts.push(match[1].trim());
    }

    // Seleniumの設定
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    const results = [];

    for (const post of posts) {
      // 一時HTMLファイルを作成
      await fs.writeFile('temp.html', post);
      await driver.get(`file://${process.cwd()}/temp.html`);

      // 投稿データの抽出
      const postData = {
        datetime: await driver.findElement(By.css('font[size="4"]')).getText().then(text => text.split('\n')[0]),
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
      };

      const hopeElement = await driver.findElements(By.css('font[color="#FF69B4"]'));
      if (hopeElement.length > 0) {
        postData.希望 = await hopeElement[0].getText();
      }

      results.push(postData);
    }

    // 一時ファイルの削除
    await fs.unlink('temp.html');

    // 結果をJSONファイルとして保存
    const jsonFileName = htmlFileName.replace('.html', '.json');
    const jsonPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'json', jsonFileName);
    await fs.writeFile(jsonPath, JSON.stringify(results, null, 2));

    console.log(`データが正常に処理され、${jsonPath} に保存されました。`);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// HTMLファイル名を指定して実行
const htmlFileName = process.argv[2];
if (!htmlFileName) {
  console.error('HTMLファイル名を引数として指定してください。');
  process.exit(1);
}

processHtmlFile(htmlFileName);