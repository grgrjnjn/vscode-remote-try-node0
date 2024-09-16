const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getLatestHtmlFile() {
    const htmlFiles = glob.sync(path.resolve(__dirname, '..', '..', 'data', 'source', 'html', 'kanajo_*.html'));
    return htmlFiles.sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime())[0];
}

function formatPostTime(dateTimeString) {
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    const date = new Date(dateTimeString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}(${dayOfWeek}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function processHtmlFile(htmlFilePath) {
  try {
    // HTMLファイルを読み込む
    const html = fs.readFileSync(htmlFilePath, 'utf-8');

    // 正規表現を使用して記事を分割
    const postRegex = /<hr align="center" color="#FFC0CB" size="2" width="100%">\s*(<font size="4">[\s\S]*?)<center>/g;
    const posts = [];
    let match;

    while ((match = postRegex.exec(html)) !== null) {
      posts.push(match[1].trim());
    }

    const results = [];

    for (const post of posts) {
      const $ = cheerio.load(post);

      // 投稿データの抽出
      const postData = {
        postTime: formatPostTime($('font[size="4"]').contents().first().text().trim()),
        name: $('a[href^="mailto:"]').text(),
        email: $('a[href^="mailto:"]').attr('href').replace('mailto:', ''),
        images: $('a[href^="https://kanajo.com/public/thread/img/"]').map((i, el) => $(el).attr('href')).get().slice(0, 3),
        message: (() => {
          const fullText = $('font[size="4"]').text();
          const lines = fullText.split('\n').map(line => line.trim()).filter(line => line);
          const startIndex = lines.findIndex(line => line.includes('[編集][通報]')) + 1;
          const endIndex = lines.findIndex(line => line.startsWith('性別 ：'));
          let message = lines.slice(startIndex, endIndex).join('\n').trim();
          const hopeElement = $('font[color="#FF69B4"]');
          if (hopeElement.length > 0) {
            message += `\n\n希望: ${hopeElement.text()}`;
          }
          return message;
        })(),
        sexuality: null,
        age: null,
        area: null,
        bodyShape: null // 新しく追加した項目
      };

      // プロフィール情報を抽出
      const profileText = $('font[size="4"]').text();
      const profileLines = profileText.split('\n').map(line => line.trim());
      
      for (const line of profileLines) {
        if (line.startsWith('性別 ：')) {
          postData.sexuality = line.replace('性別 ：', '').trim();
        } else if (line.startsWith('年齢 ：')) {
          postData.age = line.replace('年齢 ：', '').trim() || null;
        } else if (line.startsWith('地域 ：')) {
          postData.area = line.replace('地域 ：', '').trim();
        }
      }

      results.push(postData);
    }

    // 結果をJSONファイルとして保存
    const jsonFileName = path.basename(htmlFilePath, '.html') + '.json';
    const jsonPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'json', jsonFileName);
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

    console.log(`データが正常に処理され、${jsonPath} に保存されました。`);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// コマンドライン引数からHTMLファイル名を取得
let htmlFilePath = process.argv[2];

if (!htmlFilePath) {
  // ファイル名が指定されていない場合、最新のファイルを使用
  htmlFilePath = getLatestHtmlFile();
  if (!htmlFilePath) {
    console.error('HTMLファイルが見つかりません。');
    process.exit(1);
  }
  console.log(`最新のHTMLファイルを使用します: ${htmlFilePath}`);
} else {
  // 指定されたファイル名のパスを解決
  htmlFilePath = path.resolve(__dirname, '..', '..', 'data', 'source', 'html', htmlFilePath);
}

processHtmlFile(htmlFilePath);