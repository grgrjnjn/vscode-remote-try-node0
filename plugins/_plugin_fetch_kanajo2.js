// plugins/fetch_kanajo_plugin.js

// リンク先のメールアドレスを取得してHTMLを書き換える
// シンプルな実装でgood
// ES modules形式

// TODO:
// 連続10以上のアクセスをすることになるので、間隔を開ける？
// 開始時間ばいつもピッタリにならないようにランダムなスリープを入れる？


// HTMLテキストに、以下のようなaタグで囲まれたimgタグが複数ある。
// <a href="https://kanajo.com/public/thread/img/*"><img width="48px" height="64px" src="http://kanajo.com/public/assets/img/bbs/*" alt=""></a>
// この部分をaタグのhrefの値をsrcとするimgタグに置き換えたい。
// テキストに対して正規表現を用いた方が簡単ではないかと思う。


// ###具体例
// <a href="https://kanajo.com/public/thread/img/?id=9330015&amp;type=comment&amp;no=1"><img width="48px" height="64px" src="http://kanajo.com/public/assets/img/bbs/00000001/thumb_09d24649051a95379075bc60ac592714.jpg?1726886796" alt=""></a>
// ↓
// <img src="https://kanajo.com/public/thread/img/?id=9330015&amp;type=comment&amp;no=1" alt=""></a>




import { promises as fs } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const THREAD_URL = 'https://kanajo.com/public/thread/index?id=1';
const OUTPUT_DIR = 'data/source/html';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'kanajo.html');
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
  
    // 画像リンクの置換
    let serialized = dom.serialize();
    serialized = serialized.replace(
      /<a href="(https:\/\/kanajo\.com\/public\/thread\/img\/[^"]+)"><img[^>]+><\/a>/g,
      '<img src="$1" alt="">'
    );

  return dom.serialize();
}

async function saveHTML(html, fileName) {
  // 出力ディレクトリが存在しない場合は作成
  await fs.mkdir(path.dirname(fileName), { recursive: true });
  await fs.writeFile(fileName, html);
}

export async function run() {
  try {
    const html = await fetchHTML(THREAD_URL);
    const rewrittenHTML = await rewriteHTML(html);
    await saveHTML(rewrittenHTML, OUTPUT_FILE);
    return `Kanajo HTMLが保存されました: ${OUTPUT_FILE}`;
  } catch (error) {
    console.error('処理中にエラーが発生しました:', error);
    return `エラー: ${error.message}`;
  }
}

// 単体実行用のコード
if (import.meta.url === `file://${process.argv[1]}`) {
  run()
    .then(result => console.log(result))
    .catch(error => console.error('エラー:', error));
}
