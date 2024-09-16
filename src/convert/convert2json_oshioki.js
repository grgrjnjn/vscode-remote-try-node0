// htmlParser.js

const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function parseHtmlToJson(htmlContent) {
  let driver;

  try {
    // Seleniumの設定
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // 正規表現を使用して記事を分割
    const postRegex = /<hr align="center" color="#FFC0CB" size="2" width="100%">\s*(<font size="4">[\s\S]*?)<center>/g;
    const posts = [];
    let match;

    while ((match = postRegex.exec(htmlContent)) !== null) {
      posts.push(match[1].trim());
    }

    const results = [];

    for (const post of posts) {
      // 一時HTMLファイルを作成
      await driver.executeScript(`document.body.innerHTML = arguments[0]`, post);

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

    return results;

  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// ライブラリとしてエクスポート
module.exports = parseHtmlToJson;

// スクリプトが直接実行された場合のテスト用コード
if (require.main === module) {
  const fs = require('fs').promises;
  const path = require('path');

  async function testParser(htmlFileName) {
    try {
      // HTMLファイルを読み込む
      const htmlPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'html', htmlFileName);
      const html = await fs.readFile(htmlPath, 'utf-8');

      // HTMLをパースしてJSONを取得
      const jsonData = await parseHtmlToJson(html);

      // 結果をJSONファイルとして保存
      const jsonFileName = htmlFileName.replace('.html', '.json');
      const jsonPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'json', jsonFileName);
      await fs.writeFile(jsonPath, JSON.stringify(jsonData, null, 2));

      console.log(`データが正常に処理され、${jsonPath} に保存されました。`);
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  }

  // HTMLファイル名を指定して実行
  const htmlFileName = process.argv[2];
  if (!htmlFileName) {
    console.error('HTMLファイル名を引数として指定してください。');
    process.exit(1);
  }

  testParser(htmlFileName);
}