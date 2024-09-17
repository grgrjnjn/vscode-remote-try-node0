// 画像URLの取得で、リンク先大画像があればそちら、なければ小画像をURLとして採用
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getLatestHtmlFile() {
    const htmlFiles = glob.sync(path.resolve(__dirname, '..', 'data', 'source', 'html', 'kanajo_*.html'));
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
    const html = fs.readFileSync(htmlFilePath, 'utf-8');
    const postRegex = /<hr align="center" color="#FFC0CB" size="2" width="100%">\s*(<font size="4">[\s\S]*?)<center>/g;
    const posts = [];
    let match;

    while ((match = postRegex.exec(html)) !== null) {
      posts.push(match[1].trim());
    }

    const results = [];

    for (const post of posts) {
      const $ = cheerio.load(post);

      const postData = {
        postTime: formatPostTime($('font[size="4"]').contents().first().text().trim()),
        name: $('a[href^="mailto:"]').text(),
        email: $('a[href^="mailto:"]').attr('href').replace('mailto:', ''),
        images: (() => {
          const images = [];
          $('a[href^="https://kanajo.com/public/thread/img/"]').each((i, el) => {
            images.push($(el).attr('href'));
          });
          if (images.length === 0) {
            $('img').each((i, el) => {
              const src = $(el).attr('src');
              if (src && src.startsWith('http')) {
                images.push(src);
              }
            });
          }
          return images;
        })(),
        message: (() => {
          const fullText = $('font[size="4"]').text();
          const lines = fullText.split('\n').map(line => line.trim()).filter(line => line);
          const startIndex = lines.findIndex(line => line.includes('[編集][通報]')) + 1;
          const endIndex = lines.findIndex(line => line.startsWith('性別 ：'));
          let message = lines.slice(startIndex, endIndex).join('<br />').trim();
          const hopeElement = $('font[color="#FF69B4"]');
          if (hopeElement.length > 0) {
            message += `<br /><br />希望: ${hopeElement.text()}`;
          }
          return message;
        })(),
        sexuality: null,
        age: null,
        area: null,
        bodyShape: null,
        source: '<a href="https://kanajo.com/public/thread/index?id=1">カナジョ 即ヤリ東日本</a>'
      };

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

    const jsonFileName = path.basename(htmlFilePath, '.html') + '.json';
    const jsonPath = path.resolve(__dirname, '..', 'data', 'source', 'json', jsonFileName);
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

    console.log(`データが正常に処理され、${jsonPath} に保存されました。`);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

let htmlFilePath = process.argv[2];

if (!htmlFilePath) {
  htmlFilePath = getLatestHtmlFile();
  if (!htmlFilePath) {
    console.error('HTMLファイルが見つかりません。');
    process.exit(1);
  }
  console.log(`最新のHTMLファイルを使用します: ${htmlFilePath}`);
} else {
  htmlFilePath = path.resolve(__dirname, '..', 'data', 'source', 'html', htmlFilePath);
}

processHtmlFile(htmlFilePath);