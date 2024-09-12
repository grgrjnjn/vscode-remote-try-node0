// 掲示板のHTML（記事でない部分、複数記事を含む）から、1つ1つ記事を分割する処理を正規表現を用いて行いたい。
// 記事に分割したHTMLをその後に項目に分割する処理を加える予定である。
// まずは記事に分割する処理を作る。

// <hr align="center" color="#FFC0CB" size="2" width="100%">
// <font size="4">
// から、最初に現れる
// <center>
// までを1つの記事とする。

const fs = require('fs').promises;
const path = require('path');

async function splitPosts(htmlFileName) {
  try {
    // HTMLファイルを読み込む
    const htmlPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'html', htmlFileName);
    const html = await fs.readFile(htmlPath, 'utf-8');

    // 正規表現を使用して記事を分割
    const postRegex = /<hr align="center" color="#FFC0CB" size="2" width="100%">\s*(<font size="4">[\s\S]*?)<center>/g;
    const posts = [];
    let match;

    while ((match = postRegex.exec(html)) !== null) {
      posts.push(match[1].trim());
    }

    // 分割された記事を表示（デバッグ用）
    posts.forEach((post, index) => {
      console.log(`記事 ${index + 1}:`);
      console.log(post);
      console.log('-------------------');
    });

    // 結果をJSONファイルとして保存
    const jsonFileName = htmlFileName.replace('.html', '.json');
    const jsonPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'json', jsonFileName);
    await fs.writeFile(jsonPath, JSON.stringify(posts, null, 2));

    console.log(`記事が正常に分割され、${jsonPath} に保存されました。`);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// HTMLファイル名を指定して実行
const htmlFileName = 'example.html'; // 実際のファイル名に置き換えてください
splitPosts(htmlFileName);