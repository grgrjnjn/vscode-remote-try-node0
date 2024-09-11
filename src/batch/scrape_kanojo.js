const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;
const path = require('path');

async function scrapeData(htmlFileName) {
  let driver;

  try {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    const htmlPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'html', htmlFileName);
    const fileUrl = `file://${htmlPath}`;

    await driver.get(fileUrl);

    // 掲示板の投稿を含む要素を特定
    const posts = await driver.findElements(By.xpath('//hr[@color="#FFC0CB"]/following-sibling::font[@size="4"]'));

    const results = [];

    for (const post of posts) {
      try {
        const result = {};

        const postContent = await post.getText();
        const lines = postContent.split('\n').filter(line => line.trim() !== '');

        if (lines.length < 2) {
          console.warn('投稿の内容が不十分です:', postContent);
          continue;
        }

        result.postTime = lines[0].trim();
        const idLine = lines[1].split(']')[0];
        result.postId = idLine.includes('[') ? idLine.split('[')[1].trim() : idLine.trim();

        const profileIndex = lines.findIndex(line => line.startsWith('性別 ：'));
        if (profileIndex !== -1) {
          result.message = lines.slice(2, profileIndex).join('\n').trim();
          
          lines.slice(profileIndex).forEach(line => {
            if (line.includes('：')) {
              const [key, value] = line.split('：').map(item => item.trim());
              result[key] = value;
            }
          });
        } else {
          result.message = lines.slice(2).join('\n').trim();
        }

        const imageElements = await post.findElements(By.xpath('.//preceding-sibling::a[1]/img'));
        result.images = await Promise.all(imageElements.map(el => el.getAttribute('src')));

        results.push(result);
      } catch (postError) {
        console.error('投稿の処理中にエラーが発生しました:', postError);
      }
    }

    const jsonFileName = path.basename(htmlFileName, '.html') + '.json';
    const jsonFilePath = path.resolve(__dirname, '..', '..', 'data', 'source', 'json', jsonFileName);

    await fs.writeFile(jsonFilePath, JSON.stringify(results, null, 2));
    console.log(`データが正常に保存されました: ${jsonFilePath}`);

  } catch (error) {
    console.error('スクレイピング中にエラーが発生しました:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

const htmlFileName = process.argv[2];

if (!htmlFileName) {
  console.error('HTMLファイル名を引数として指定してください。');
  process.exit(1);
}

scrapeData(htmlFileName);