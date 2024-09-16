
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getLatestHtmlFile() {
  const htmlFiles = glob.sync(path.resolve(__dirname, '..', 'data', 'source', 'html', 'oshioki_*.html'));
  return htmlFiles.sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime())[0];
}

function formatPostTime(dateTimeString) {
  const match = dateTimeString.match(/(\d{4})\.(\d{2})\.(\d{2})\((\w+)\) (\d{2}:\d{2})/);
  if (match) {
    const [, year, month, day, dayOfWeek, time] = match;
    return `${year}-${month}-${day}(${dayOfWeek}) ${time}`;
  }
  return dateTimeString; // フォーマットが一致しない場合は元の文字列を返す
}

function scrapeData(htmlFilePath) {
  try {
    // HTMLファイルを同期的に読み込む
    const html = fs.readFileSync(htmlFilePath, 'utf8');

    // Cheerioを使用してHTMLをパース
    const $ = cheerio.load(html);

    const results = [];

    // 全ての掲示板パネルを取得
    $('.panel-board').each((index, element) => {
      const result = {};

      // 名前とメールアドレスを取得
      const nameElement = $(element).find('.panel-head a');
      result.name = nameElement.text().trim();
      result.email = nameElement.attr('href').replace('mailto:', '');

      // プロフィール情報を取得
      const profileMap = {
        '住所': 'area',
        '年齢': 'age',
        'ｽﾀｲﾙ': 'sexuality',
        '体型': 'bodyShape'
      };

      $(element).find('.panel-prof .pp_outer').each((i, profElement) => {
        const text = $(profElement).text();
        const key = text.split(':')[0].replace('[', '').trim();
        const value = $(profElement).find('.pp_inner').text().trim();
        const mappedKey = profileMap[key] || key;
        result[mappedKey] = value;
      });

      // メッセージを取得
      result.message = $(element).find('.panel-mess').html().trim();

      // 画像URLを取得（ベースURLを補完）
      result.images = $(element).find('.panel-image-item a').map((i, el) => {
        let href = $(el).attr('href');
        // file:// プロトコルを除去し、ベースURLを補完
        href = href.replace(/^file:\/\//, '');
        return href.startsWith('/') ? `https://oshioki24.com${href}` : `https://oshioki24.com/${href}`;
      }).get();

      // 投稿時間を取得し、フォーマットを変更
      const rawPostTime = $(element).find('.panel-time').text().trim();
      result.postTime = formatPostTime(rawPostTime);

      // source項目を追加
      result.source = '<a href="https://oshioki24.com/board/search/3/13/1/">おしおき関東掲示板</a>';

      results.push(result);
    });

    // JSONファイルの名前と保存場所を設定
    const jsonFileName = path.basename(htmlFilePath, '.html') + '.json';
    const jsonFilePath = path.resolve(__dirname, '..', 'data', 'source', 'json', jsonFileName);

    // 結果をJSONファイルに同期的に保存
    fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2));
    console.log(`データが正常に保存されました: ${jsonFilePath}`);

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
  htmlFilePath = path.resolve(__dirname, '..', 'data', 'source', 'html', htmlFilePath);
}

scrapeData(htmlFilePath);