
// JSDOMの設定でvirtualConsoleオプションを使用して、エラーを抑制しつつ実行を続ける
// ES modules形式


// const { JSDOM, VirtualConsole } = require('jsdom');
// const fs = require('fs').promises;


fetch_oshioki.jsをプラグインにしてください。
処理内容が変更にならないように慎重に対応お願いします。処理内容は変更しないでください。
プラグイン化したコード全体を示してください。


//plugins/plugin_example1.js
export function run() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Example plugin 1 executed');
      resolve('Example plugin 1 result');
    }, 1000);
  });
}


// fetch_oshioki.js
import { JSDOM, VirtualConsole } from 'jsdom';
import { promises as fs } from 'fs';


const url = 'https://oshioki24.com/board/search/3/13/0/1';
const outputFile = 'oshioki.html';

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
    await new Promise(resolve => setTimeout(resolve, 5000));  // 5秒

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