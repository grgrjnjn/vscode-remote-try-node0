const fs = require('fs').promises;
const path = require('path');

// URLを引数に取り、Webサイトにアクセスし、HTMLを返す関数
async function fetchHTML(url) {
  try {
    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('HTMLの取得中にエラーが発生しました:', error);
    throw error;
  }
}

// HTMLを書き換える関数
async function RewriteHTML(html) {
  const regex = /<a href="https:\/\/kanajo\.com\/public\/mail\/\?type=comment&id=(\d+)">/g;
  let match;
  let rewrittenHTML = html;

  while ((match = regex.exec(html)) !== null) {
    const commentUrl = match[0].slice(9, -2);
    const commentHtml = await fetchHTML(commentUrl);
    const emailRegex = /<a href="mailto:([^"]+)">/;
    const emailMatch = commentHtml.match(emailRegex);

    if (emailMatch) {
      const emailLink = emailMatch[0];
      rewrittenHTML = rewrittenHTML.replace(match[0], emailLink);
    }
  }

  return rewrittenHTML;
}

// HTMLと、相対パスを含むファイル名を引数に取り、HTMLをファイルとして保存する関数
async function saveHTML(html, fileName) {
  try {
    const fullPath = path.resolve(fileName);
    await fs.writeFile(fullPath, html);
    console.log(`HTMLが保存されました: ${fullPath}`);
  } catch (error) {
    console.error('HTMLの保存中にエラーが発生しました:', error);
    throw error;
  }
}

// 使用例
async function main() {
  const url = 'https://kanajo.com/public/thread/index?id=1';
  const outputFileName = 'output.html';

  try {
    const html = await fetchHTML(url);
    const rewrittenHTML = await RewriteHTML(html);
    await saveHTML(rewrittenHTML, outputFileName);
  } catch (error) {
    console.error('処理中にエラーが発生しました:', error);
  }
}

main();