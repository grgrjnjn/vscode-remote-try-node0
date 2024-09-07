const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

async function scrapeData() {
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

    // ページにアクセス（実際のURLに置き換えてください）
    await driver.get('https://oshioki24.com/board/search/3/13/1/');

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

      // 画像URLを取得
      const imageElements = await panel.findElements(By.css('.panel-image-item a'));
      result.images = await Promise.all(imageElements.map(el => el.getAttribute('href')));

      // 投稿時間を取得
      result.postTime = await panel.findElement(By.css('.panel-time')).getText();

      results.push(result);
    }

    // 結果をJSONファイルに保存
    fs.writeFileSync('board_data.json', JSON.stringify(results, null, 2));
    console.log('データが正常に保存されました。');

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

scrapeData();