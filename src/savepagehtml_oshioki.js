const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;
const path = require('path');

const createChromeOptions = () => 
  new chrome.Options()
    .addArguments('--headless')
    .addArguments('--no-sandbox')
    .addArguments('--disable-dev-shm-usage');

const createDriver = options => 
  new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

const getPageHtml = async (driver, url) => {
  await driver.get(url);
  return driver.getPageSource();
};

const generateFileName = () => {
  const formatDate = date => 
    date.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  return `oshioki_${formatDate(new Date())}.html`;
};

const ensureDirectoryExists = async dirPath => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

const saveHtmlToFile = async (dirPath, filename, content) => {
  await ensureDirectoryExists(dirPath);
  const fullPath = path.join(dirPath, filename);
  await fs.writeFile(fullPath, content, 'utf-8');
  return fullPath;
};

const logSuccess = filePath => 
  console.log(`File saved successfully: ${filePath}`);

const handleError = error => 
  console.error('An error occurred:', error);

const cleanup = async driver => {
  if (driver) {
    await driver.quit();
  }
};

const pipe = (...fns) => x => 
  fns.reduce((v, f) => f(v), x);

const savePageHtml = async url => {
  const driver = await createDriver(createChromeOptions());
  const outputDir = path.join(__dirname, '..', 'data', 'source', 'html');
  
  try {
    const htmlContent = await getPageHtml(driver, url);
    const filename = generateFileName();
    
    const savedFilePath = await pipe(
      () => saveHtmlToFile(outputDir, filename, htmlContent),
      logSuccess
    )();
    
    return savedFilePath;
  } catch (error) {
    handleError(error);
  } finally {
    await cleanup(driver);
  }
};

// 実行
const url = 'https://oshioki24.com/board/search/3/13/1/';
savePageHtml(url).then(() => console.log('Process completed'));