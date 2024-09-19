const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs').promises;

const url = 'https://oshioki24.com/board/search/3/13/0/1';
const outputFile = 'output.html';

async function fetchAndSaveHTML() {
  try {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => { /* エラーを無視 */ });

    const dom = await JSDOM.fromURL(url, {
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true,
      virtualConsole
    });

    // ページの読み込みを待つ
    await new Promise(resolve => {
      dom.window.addEventListener('load', resolve);
    });

    // さらに時間を置いて待つ（必要に応じて調整）
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 動的に生成されたHTMLを取得
    const html = dom.serialize();

    // HTMLをファイルに保存
    await fs.writeFile(outputFile, html);
    console.log(`HTMLが保存されました: ${outputFile}`);

    // リソースを解放
    dom.window.close();
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

fetchAndSaveHTML();