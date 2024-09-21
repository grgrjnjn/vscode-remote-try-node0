const fs = require('fs').promises;

const url = 'https://oshioki24.com/board/search/3/13/0/1'; // スクレイピングしたいWebサイトのURL
const outputFile = 'output.html';

async function fetchAndSaveHTML() {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    await fs.writeFile(outputFile, html);
    console.log(`HTMLが保存されました: ${outputFile}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

fetchAndSaveHTML();