const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;
const path = require('path');

async function scrapeData(htmlFileName) {
  let driver;

  try {
    // Chromeをヘッドレスモードで設定
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    // WebDriverを初期化
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // ローカルのHTMLファイルのパスを取得
    const htmlPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'html', htmlFileName);
    const fileUrl = `file://${htmlPath}`;

    // ローカルのHTMLファイルにアクセス
    await driver.get(fileUrl);

    // 全ての掲示板パネルを取得
    const panels = await driver.findElements(By.css('.panel-board'));

    const results = [];

    for (const panel of panels) {
      const result = {};

      // 名前とメールアドレスを取得
      const nameElement = await panel.findElement(By.css('.panel-head a'));
      result.name = await nameElement.getText();
      result.email = await nameElement.getAttribute('href').then(href => href.replace('mailto:', ''));

      // プロフィール情報を取得
      const profElements = await panel.findElements(By.css('.panel-prof .pp_outer'));
      for (const profElement of profElements) {
        const key = await profElement.getText().then(text => text.split(':')[0].replace('[', '').trim());
        const value = await profElement.findElement(By.css('.pp_inner')).getText();
        result[key] = value;
      }

      // メッセージを取得
      result.message = await panel.findElement(By.css('.panel-mess')).getText();

      // 画像URLを取得（ベースURLを補完）
      const imageElements = await panel.findElements(By.css('.panel-image-item a'));
      result.images = await Promise.all(imageElements.map(async (el) => {
        let href = await el.getAttribute('href');
        // file:// プロトコルを除去し、ベースURLを補完
        href = href.replace(/^file:\/\//, '');
        return href.startsWith('/') ? `https://oshioki24.com${href}` : `https://oshioki24.com/${href}`;
      }));

      // 投稿時間を取得
      result.postTime = await panel.findElement(By.css('.panel-time')).getText();

      results.push(result);
    }

    // JSONファイルの名前と保存場所を設定
    const jsonFileName = path.basename(htmlFileName, '.html') + '.json';
    const jsonFilePath = path.resolve(__dirname, '..', '..', 'data', 'source', 'json', jsonFileName);

    // 結果をJSONファイルに保存
    await fs.writeFile(jsonFilePath, JSON.stringify(results, null, 2));
    console.log(`データが正常に保存されました: ${jsonFilePath}`);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// コマンドライン引数からHTMLファイル名を取得
const htmlFileName = process.argv[2];

if (!htmlFileName) {
  console.error('HTMLファイル名を引数として指定してください。');
  process.exit(1);
}

scrapeData(htmlFileName);