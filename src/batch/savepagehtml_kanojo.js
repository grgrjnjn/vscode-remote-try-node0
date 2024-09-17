// HTML取得時にリンク先のメールアドレスを取得
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;
const path = require('path');

async function scrapeAndModifyHtml(url) {
  let driver;

  try {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get(url);
    const html = await driver.getPageSource();
    const modifiedHtml = await modifyLinks(driver, html);

    const fileName = `kanajo_${Date.now()}.html`;
    const outputDir = path.join(__dirname, '..', '..', 'data', 'source', 'html');
    await ensureDirectoryExists(outputDir);
    const filePath = path.join(outputDir, fileName);
    await fs.writeFile(filePath, modifiedHtml);

    console.log(`Modified HTML saved to: ${filePath}`);

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

async function modifyLinks(driver, html) {
  const linkPattern = /<a href="https:\/\/kanajo\.com\/public\/mail\/\?type=comment&amp;id=(\d+)">([^<]+)<\/a>/g;
  let match;
  let modifiedHtml = html;

  while ((match = linkPattern.exec(html)) !== null) {
    const [fullMatch, id, linkText] = match;
    const mailUrl = `https://kanajo.com/public/mail/?type=comment&id=${id}`;
    
    await driver.get(mailUrl);
    const mailLink = await driver.wait(until.elementLocated(By.css('a[href^="mailto:"]')), 5000);
    const mailHref = await mailLink.getAttribute('href');
    const email = mailHref.replace('mailto:', '');

    const newLink = `<a href="mailto:${email}">${linkText}</a>`;
    modifiedHtml = modifiedHtml.replace(fullMatch, newLink);
  }

  return modifiedHtml;
}

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

const url = 'https://kanajo.com/public/thread/index?id=1';
scrapeAndModifyHtml(url);