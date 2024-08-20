const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver'); // Chromeを使用する場合

(async function example() {
  let options = new chrome.Options();
  options.addArguments('--headless'); // ヘッドレスモードを有効にする
  options.addArguments('--no-sandbox'); // サンドボックスを無効にする
  options.addArguments('--disable-dev-shm-usage'); // /dev/shmの使用を無効にする
  options.addArguments('--window-size=1280,720'); // ウィンドウサイズを指定

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get('http://www.google.com');
    await driver.findElement(By.name('q')).sendKeys('Hello World!', Key.RETURN);
    await driver.wait(until.titleIs('Hello World! - Google Search'), 5000);
  } finally {
    await driver.quit();
  }
})();