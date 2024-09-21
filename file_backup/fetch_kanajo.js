// リンク先のメールアドレスを取得してHTMLを書き換える
// シンプルな実装でgood
// ES modules形式

// TODO:
// 連続10以上のアクセスをすることになるので、間隔を開ける？
// 開始時間ばいつもピッタリにならないようにランダムなスリープを入れる？

fetch_kanajo.jsをプラグインにしてください。
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

// fetch_kanajo.js
import { promises as fs } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const THREAD_URL = 'https://kanajo.com/public/thread/index?id=1';
const OUTPUT_FILE = 'kanajo.html';
const MAIL_LINK_PATTERN = /https:\/\/kanajo\.com\/public\/mail\/\?type=comment&id=\d+/;

async function fetchHTML(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.text();
}

async function rewriteHTML(html) {
  const dom = new JSDOM(html);
  const links = dom.window.document.querySelectorAll('a');

  for (const link of links) {
    if (MAIL_LINK_PATTERN.test(link.href)) {
      const commentHtml = await fetchHTML(link.href);
      const commentDom = new JSDOM(commentHtml);
      const emailLink = commentDom.window.document.querySelector('a[href^="mailto:"]');
      if (emailLink) {
        link.outerHTML = emailLink.outerHTML;
      }
    }
  }

  return dom.serialize();
}

async function saveHTML(html, fileName) {
  const fullPath = path.resolve(fileName);
  await fs.writeFile(fullPath, html);
  console.log(`HTMLが保存されました: ${fullPath}`);
}

async function main() {
  try {
    const html = await fetchHTML(THREAD_URL);
    const rewrittenHTML = await rewriteHTML(html);
    await saveHTML(rewrittenHTML, OUTPUT_FILE);
  } catch (error) {
    console.error('処理中にエラーが発生しました:', error);
  }
}

main();