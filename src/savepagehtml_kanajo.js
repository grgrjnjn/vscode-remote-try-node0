// 関数型プログラミング

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;
const path = require('path');

const createDriver = () => {
  const options = new chrome.Options();
  options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
  return new Builder().forBrowser('chrome').setChromeOptions(options).build();
};

const getPageSource = async (driver, url) => {
  await driver.get(url);
  return driver.getPageSource();
};

const modifyLink = async (driver, match) => {
  const [fullMatch, id, linkText] = match;
  const mailUrl = `https://kanajo.com/public/mail/?type=comment&id=${id}`;
  await driver.get(mailUrl);
  const mailLink = await driver.wait(until.elementLocated(By.css('a[href^="mailto:"]')), 5000);
  const mailHref = await mailLink.getAttribute('href');
  const email = mailHref.replace('mailto:', '');
  return { fullMatch, newLink: `<a href="mailto:${email}">${linkText}</a>` };
};

const modifyLinks = async (driver, html) => {
  const linkPattern = /<a href="https:\/\/kanajo\.com\/public\/mail\/\?type=comment&amp;id=(\d+)">([^<]+)<\/a>/g;
  const matches = [...html.matchAll(linkPattern)];
  const modifications = await Promise.all(matches.map(match => modifyLink(driver, match)));
  return modifications.reduce((acc, { fullMatch, newLink }) => acc.replace(fullMatch, newLink), html);
};

const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

const saveHtml = async (html, outputDir) => {
  const fileName = `kanajo_${Date.now()}.html`;
  await ensureDirectoryExists(outputDir);
  const filePath = path.join(outputDir, fileName);
  await fs.writeFile(filePath, html);
  return filePath;
};

const scrapeAndModifyHtml = async (url) => {
  let driver;
  try {
    driver = await createDriver();
    const html = await getPageSource(driver, url);
    const modifiedHtml = await modifyLinks(driver, html);
    const outputDir = path.join(__dirname, '..', 'data', 'source', 'html');
    const filePath = await saveHtml(modifiedHtml, outputDir);
    console.log(`Modified HTML saved to: ${filePath}`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    if (driver) await driver.quit();
  }
};

const url = 'https://kanajo.com/public/thread/index?id=1';
scrapeAndModifyHtml(url);