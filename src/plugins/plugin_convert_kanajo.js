// // 画像URLの取得で、リンク先大画像があればそちら、なければ小画像をURLとして採用



// // 以下のコードは正常に意図した通りに動作しています。
// // より明瞭に、よりシンプルな実装にするための提案をください。
// // 処理内容が変わってはいけません。処理内容は一切変更しません。

// $ node src/scrape_kanajo.js
// と実行され正常動作していたscrape_kanajo.jsを、
// src/plugins/plugin_convert_kanajo.js
// として動作するように修正します。
// 実行は
// $ node src/do_plugins.js
// とします。

// scrape_kanajo.jsの処理内容は変えないことが重要です。処理内容は変えないでください。
// plugin_convert_kanajo.jsのすべてのコードを示してください。


// // src/do_plugins.js
// import { promises as fs } from 'fs';
// import path from 'path';
// import url from 'url';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// async function runPlugins(pluginsDir) {
//   const pluginFiles = await fs.readdir(pluginsDir);
//   const jsFiles = pluginFiles.filter(file => /^plugin_.+\.js$/.test(file));

//   const results = await Promise.all(jsFiles.map(async (file) => {
//     try {
//       const pluginPath = path.join(pluginsDir, file);
//       const plugin = await import(url.pathToFileURL(pluginPath));
//       return await plugin.run();
//     } catch (error) {
//       console.error(`Error in plugin ${file}: ${error.message}`);
//       return null;
//     }
//   }));

//   return results.filter(result => result !== null);
// }

// async function main() {
//   const pluginsDir = path.join(__dirname, '..', 'src', 'plugins');
//   try {
//     const results = await runPlugins(pluginsDir);
//     console.log('All plugins executed. Results:', results);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// main();





// // scrape_kanajo.js
// import { load } from 'cheerio';
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];
// const POST_REGEX = /<hr align="center" color="#FFC0CB" size="2" width="100%">\s*(<font size="4">[\s\S]*?)<center>/g;
// const SOURCE_LINK = '<a href="https://kanajo.com/public/thread/index?id=1">カナジョ 即ヤリ東日本</a>';

// const formatPostTime = (dateTimeString) => {
//     const date = new Date(dateTimeString);
//     const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}(${dayOfWeek}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
// };

// const extractImages = ($) => {
//     const images = [];
//     $('a[href^="https://kanajo.com/public/thread/img/"]').each((i, el) => {
//         images.push($(el).attr('href'));
//     });
//     if (images.length === 0) {
//         $('img').each((i, el) => {
//             const src = $(el).attr('src');
//             if (src && src.startsWith('http')) {
//                 images.push(src);
//             }
//         });
//     }
//     return images;
// };

// const extractMessage = ($) => {
//     const fullText = $('font[size="4"]').text();
//     const lines = fullText.split('\n').map(line => line.trim()).filter(line => line);
//     const startIndex = lines.findIndex(line => line.includes('[編集][通報]')) + 1;
//     const endIndex = lines.findIndex(line => line.startsWith('性別 ：'));
//     let message = lines.slice(startIndex, endIndex).join('<br />').trim();
//     const hopeElement = $('font[color="#FF69B4"]');
//     if (hopeElement.length > 0) {
//         message += `<br /><br />希望: ${hopeElement.text()}`;
//     }
//     return message;
// };

// const extractProfileInfo = (profileLines) => {
//     const profileInfo = { sexuality: null, age: null, area: null };
//     for (const line of profileLines) {
//         if (line.startsWith('性別 ：')) {
//             profileInfo.sexuality = line.replace('性別 ：', '').trim();
//         } else if (line.startsWith('年齢 ：')) {
//             profileInfo.age = line.replace('年齢 ：', '').trim() || null;
//         } else if (line.startsWith('地域 ：')) {
//             profileInfo.area = line.replace('地域 ：', '').trim();
//         }
//     }
//     return profileInfo;
// };

// const parsePost = (post) => {
//     const $ = load(post);
//     const postData = {
//         postTime: formatPostTime($('font[size="4"]').contents().first().text().trim()),
//         name: $('a[href^="mailto:"]').text(),
//         email: $('a[href^="mailto:"]').attr('href').replace('mailto:', ''),
//         images: extractImages($),
//         message: extractMessage($),
//         bodyShape: null,
//         source: SOURCE_LINK
//     };

//     const profileText = $('font[size="4"]').text();
//     const profileLines = profileText.split('\n').map(line => line.trim());
//     Object.assign(postData, extractProfileInfo(profileLines));

//     return postData;
// };

// async function processHtmlFile(htmlFilePath) {
//     try {
//         const html = await fs.readFile(htmlFilePath, 'utf-8');
//         const posts = [...html.matchAll(POST_REGEX)].map(match => match[1].trim());
//         const results = posts.map(parsePost);

//         const jsonFileName = path.basename(htmlFilePath, '.html') + '.json';
//         const jsonPath = path.resolve(__dirname, '..', 'data', 'source', 'json', jsonFileName);
//         await fs.writeFile(jsonPath, JSON.stringify(results, null, 2));

//         console.log(`データが正常に処理され、${jsonPath} に保存されました。`);
//     } catch (error) {
//         console.error('エラーが発生しました:', error);
//     }
// }

// const htmlFilePath = path.resolve(__dirname, '..', 'data', 'source', 'html', 'kanajo.html');
// processHtmlFile(htmlFilePath);


// src/plugins/plugin_convert_kanajo.js
import { load } from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];
const POST_REGEX = /<hr align="center" color="#FFC0CB" size="2" width="100%">\s*(<font size="4">[\s\S]*?)<center>/g;
const SOURCE_LINK = '<a href="https://kanajo.com/public/thread/index?id=1">カナジョ 即ヤリ東日本</a>';

const formatPostTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}(${dayOfWeek}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const extractImages = ($) => {
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
};

const extractMessage = ($) => {
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
};

const extractProfileInfo = (profileLines) => {
    const profileInfo = { sexuality: null, age: null, area: null };
    for (const line of profileLines) {
        if (line.startsWith('性別 ：')) {
            profileInfo.sexuality = line.replace('性別 ：', '').trim();
        } else if (line.startsWith('年齢 ：')) {
            profileInfo.age = line.replace('年齢 ：', '').trim() || null;
        } else if (line.startsWith('地域 ：')) {
            profileInfo.area = line.replace('地域 ：', '').trim();
        }
    }
    return profileInfo;
};

const parsePost = (post) => {
    const $ = load(post);
    const postData = {
        postTime: formatPostTime($('font[size="4"]').contents().first().text().trim()),
        name: $('a[href^="mailto:"]').text(),
        email: $('a[href^="mailto:"]').attr('href').replace('mailto:', ''),
        images: extractImages($),
        message: extractMessage($),
        bodyShape: null,
        source: SOURCE_LINK
    };

    const profileText = $('font[size="4"]').text();
    const profileLines = profileText.split('\n').map(line => line.trim());
    Object.assign(postData, extractProfileInfo(profileLines));

    return postData;
};

async function processHtmlFile(htmlFilePath) {
    try {
        const html = await fs.readFile(htmlFilePath, 'utf-8');
        const posts = [...html.matchAll(POST_REGEX)].map(match => match[1].trim());
        const results = posts.map(parsePost);

        const jsonFileName = path.basename(htmlFilePath, '.html') + '.json';
        const jsonPath = path.resolve(__dirname, '..', '..', 'data', 'source', 'json', jsonFileName);
        await fs.writeFile(jsonPath, JSON.stringify(results, null, 2));

        return `データが正常に処理され、${jsonPath} に保存されました。`;
    } catch (error) {
        console.error('エラーが発生しました:', error);
        throw error;
    }
}

export async function run() {
    const htmlFilePath = path.resolve(__dirname, '..', '..', 'data', 'source', 'html', 'kanajo.html');
    return await processHtmlFile(htmlFilePath);
}