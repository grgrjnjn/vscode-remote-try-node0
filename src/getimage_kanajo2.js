// // 画像をダウンロードして、JSONも修正
// // リサイズ機能追加


// // CoomonJS形式からES modules形式に変換してください。
// // 読み込むJSONファイルは、data/source/json/kanajo_*の最新ファイルではなく、data/source/json/kanajo.jsonと決め打ちに変更。
// // それ以外の処理は変更しません。処理内容が変更しないようにお願いします。
// // 修正後の全てのコードを示してください。

// main() {
//     target = readJSON(data/source/json/kanajo.json);
//     images = getImages(extractURLs(target));
//     shrinkImages(images);
//     target = uptedateJSON(target);
//     saveJson(target, public/board_data.json);
// }


// 処理内容が明瞭になり、シンプルな実装となるように変更を提案してください。
// main関数を以下の通りとします。
// (1)kanajo.jsonを読み込む
// (2)JSONデータを引数として受け取り、画像をpublic/image/にダウンロードして、画像のファイル名のリストを返す関数を呼び出す
// (3)画像のファイル名のリストを引数として受け取り、画像サイズを縮小する関数を呼び出す
// (4)JSONデータを引数として受け取り、imagesの値 https://kanajo.com/public/thread/img/* を変更して、JSONを返す
// (5)JSONを引数として受け取り、public/board_data.jsonに保存する関数を呼び出す


// (2)JSONデータを引数として受け取り、画像をpublic/image/にダウンロードして、画像のファイル名のリストを返す関数は、
// ・JSONデータから imagesの値 https://kanajo.com/public/thread/img/* のURLを抽出してリストを作る
// ・public/image/に保存名と同名のファイルがある場合は、URLリストからそのURLを削除する
// ・URLリストを順次処理して画像をダウンロードしてpublic/image/に保存する
// ・保存したファイルのパス付きファイル名リストを返す





// import fs from 'fs';
// import path from 'path';
// import https from 'https';
// import http from 'http';
// import { load } from 'cheerio';
// import mime from 'mime-types';
// import url from 'url';
// import sharp from 'sharp';
// import { fileURLToPath } from 'url';
// import { json } from 'express';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// function downloadImage(imageUrl, outputPath) {
//   return new Promise((resolve, reject) => {
//       const protocol = url.parse(imageUrl).protocol === 'https:' ? https : http;
//       protocol.get(imageUrl, {
//           followAllRedirects: true,
//           maxRedirects: 5
//       }, (response) => {
//           if (response.statusCode === 200) {
//               const contentType = response.headers['content-type'];
//               const extension = mime.extension(contentType) || 'jpg';
//               const filePath = `${outputPath}.${extension}`;
              
//               const chunks = [];
//               response.on('data', (chunk) => chunks.push(chunk));
//               response.on('end', () => {
//                   const buffer = Buffer.concat(chunks);
                  
//                   sharp(buffer)
//                       .metadata()
//                       .then(metadata => {
//                           const sizeThreshold = 10 * 1024; // 10KB
//                           const imageSize = buffer.length;

//                           if (imageSize > sizeThreshold) {
//                               const scaleFactor = Math.sqrt(sizeThreshold / imageSize);
//                               const newWidth = Math.round(metadata.width * scaleFactor);
//                               const newHeight = Math.round(metadata.height * scaleFactor);

//                               return sharp(buffer)
//                                   .resize(newWidth, newHeight)
//                                   .toFile(filePath);
//                           } else {
//                               return fs.promises.writeFile(filePath, buffer);
//                           }
//                       })
//                       .then(() => {
//                           resolve(filePath);
//                       })
//                       .catch(reject);
//               });
//           } else if (response.statusCode === 301 || response.statusCode === 302) {
//               // リダイレクトを処理
//               downloadImage(response.headers.location, outputPath)
//                   .then(resolve)
//                   .catch(reject);
//           } else {
//               reject(new Error(`Failed to download image: ${response.statusCode}`));
//           }
//       }).on('error', reject);
//   });
// }

// function processImages(data, outputDir) {
//     data.forEach(item => {
//         if (item.images && Array.isArray(item.images)) {
//             item.images = item.images.map(imageUrl => {
//                 if (imageUrl.startsWith('https://kanajo.com/public/thread/img/')) {
//                     const urlParams = new URL(imageUrl).searchParams;
//                     const id = urlParams.get('id');
//                     const no = urlParams.get('no');
//                     if (id && no) {
//                         const outputPath = path.join(outputDir, `kanajo_${id}-${no}`);
//                         return new Promise((resolve, reject) => {
//                             const protocol = url.parse(imageUrl).protocol === 'https:' ? https : http;
//                             protocol.get(imageUrl, {
//                                 followAllRedirects: true,
//                                 maxRedirects: 5
//                             }, (response) => {
//                                 let data = '';
//                                 response.on('data', (chunk) => {
//                                     data += chunk;
//                                 });
//                                 response.on('end', () => {
//                                     const $ = load(data);
//                                     const imgSrc = $('img').attr('src');
//                                     if (imgSrc) {
//                                         downloadImage(imgSrc, outputPath)
//                                             .then(filePath => resolve(path.relative(process.cwd(), filePath)))
//                                             .catch(reject);
//                                     } else {
//                                         resolve(imageUrl);
//                                     }
//                                 });
//                             }).on('error', reject);
//                         });
//                     }
//                 }
//                 return Promise.resolve(imageUrl);
//             });
//             item.images = Promise.all(item.images);
//         }
//     });
//     return Promise.all(data.map(async item => {
//         if (item.images) {
//             item.images = await item.images;
//         }
//         return item;
//     }));
// }

// async function main() {
//     const sourceDir = path.join(__dirname, '..', 'data', 'source', 'json');
//     const inputPath = path.join(sourceDir, 'kanajo.json');
//     const outputDir = path.join(__dirname, '..', 'data', 'source', 'image');

//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir, { recursive: true });
//     }

//     const data = JSON.parse(await fs.promises.readFile(inputPath, 'utf8'));
//     const processedData = await processImages(data, outputDir);

//     await fs.promises.writeFile(inputPath, JSON.stringify(processedData, null, 2));
//     console.log(`Processed and saved: ${inputPath}`);
// }

// main().catch(console.error);



// 画像の保存するファイル名は、URLのidとnoをとって、
// kanajo_{id}-{id}.拡張子
// となるようにしてください。
// ファイル名作成は関数にしてください。

// URL例
// https://kanajo.com/public/thread/img/?id=9330469&type=comment&no=1

// それ以外の処理は変えないでください。
// 修正後の全てのコードを示してください。




// "images": [
//     "image/kanajo_9330469-1.jpeg",
//     "image/kanajo_9330469-2.jpeg",
//     "image/kanajo_9330469-3.jpeg"
//   ],



import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createFileName(url) {
  const params = new URL(url).searchParams;
  const id = params.get('id');
  const no = params.get('no');
  return `kanajo_${id}-${no}.jpeg`;
}

async function readJsonFile(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function downloadImages(jsonData) {
  const outputDir = path.join(__dirname, '..', 'public', 'image');

  const imageUrls = jsonData.flatMap(item => item.images || [])
    .filter(url => url.startsWith('https://kanajo.com/public/thread/img/'));

  const downloadedFiles = [];

  for (const imageUrl of imageUrls) {
    const filePath = path.join(outputDir, createFileName(imageUrl));

    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      continue;
    }

    await new Promise((resolve, reject) => {
      https.get(imageUrl, (res) => {
        if (res.statusCode === 200) {
          const fileStream = createWriteStream(filePath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            downloadedFiles.push(filePath);
            resolve();
          });
        } else {
          reject(new Error(`Failed to download image: ${res.statusCode}`));
        }
      }).on('error', reject);
    });
  }

  return downloadedFiles;
}

async function resizeImages(imageFiles) {
  for (const filePath of imageFiles) {
    await sharp(filePath)
      .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
      .toFile(filePath + '_resized');
  }
}

function updateJsonData(jsonData) {
  return jsonData.map(item => ({
    ...item,
    images: item.images?.map(url => 
      url.startsWith('https://kanajo.com/public/thread/img/') 
        ? `image/${createFileName(url)}_resized`
        : url
    )
  }));
}

async function saveJsonFile(data, filePath) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function main() {
  const inputPath = path.join(__dirname, '..', 'data', 'source', 'json', 'kanajo.json');
  const outputPath = path.join(__dirname, '..', 'public', 'board_data.json');

  const jsonData = await readJsonFile(inputPath);
  const downloadedFiles = await downloadImages(jsonData);
  await resizeImages(downloadedFiles);
  const updatedJsonData = updateJsonData(jsonData);
  await saveJsonFile(updatedJsonData, outputPath);

  console.log(`Processed and saved: ${outputPath}`);
}

main().catch(console.error);