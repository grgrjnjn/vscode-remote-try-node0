const { Builder } = require('selenium-webdriver');
const fs = require('fs');

(async function savePageHtml() {
    // Chromeオプションを設定してヘッドレスモードを有効にする
    let chrome = require('selenium-webdriver/chrome');
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    // WebDriverのインスタンスを作成
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // 指定されたURLにアクセス
        await driver.get('https://oshioki24.com/board/search/3/13/1/');

        // HTMLを取得
        let htmlContent = await driver.getPageSource();

        // HTMLをファイルに保存
        fs.writeFileSync('page.html', htmlContent, 'utf-8');
        console.log('page.html saved successfully.');
    } finally {
        // WebDriverを終了
        await driver.quit();
    }
})();