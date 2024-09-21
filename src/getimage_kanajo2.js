// 画像をダウンロードして、JSONも修正
// リサイズ機能追加


// CoomonJS形式からES modules形式に変換してください。
// 読み込むJSONファイルは、data/source/json/kanajo_*の最新ファイルではなく、data/source/json/kanajo.jsonと決め打ちに変更。
// それ以外の処理は変更しません。処理内容が変更しないようにお願いします。
// 修正後の全てのコードを示してください。

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { load } from 'cheerio';
import mime from 'mime-types';
import url from 'url';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function downloadImage(imageUrl, outputPath) {
  return new Promise((resolve, reject) => {
      const protocol = url.parse(imageUrl).protocol === 'https:' ? https : http;
      protocol.get(imageUrl, {
          followAllRedirects: true,
          maxRedirects: 5
      }, (response) => {
          if (response.statusCode === 200) {
              const contentType = response.headers['content-type'];
              const extension = mime.extension(contentType) || 'jpg';
              const filePath = `${outputPath}.${extension}`;
              
              const chunks = [];
              response.on('data', (chunk) => chunks.push(chunk));
              response.on('end', () => {
                  const buffer = Buffer.concat(chunks);
                  
                  sharp(buffer)
                      .metadata()
                      .then(metadata => {
                          const sizeThreshold = 10 * 1024; // 10KB
                          const imageSize = buffer.length;

                          if (imageSize > sizeThreshold) {
                              const scaleFactor = Math.sqrt(sizeThreshold / imageSize);
                              const newWidth = Math.round(metadata.width * scaleFactor);
                              const newHeight = Math.round(metadata.height * scaleFactor);

                              return sharp(buffer)
                                  .resize(newWidth, newHeight)
                                  .toFile(filePath);
                          } else {
                              return fs.promises.writeFile(filePath, buffer);
                          }
                      })
                      .then(() => {
                          resolve(filePath);
                      })
                      .catch(reject);
              });
          } else if (response.statusCode === 301 || response.statusCode === 302) {
              // リダイレクトを処理
              downloadImage(response.headers.location, outputPath)
                  .then(resolve)
                  .catch(reject);
          } else {
              reject(new Error(`Failed to download image: ${response.statusCode}`));
          }
      }).on('error', reject);
  });
}

function processImages(data, outputDir) {
    data.forEach(item => {
        if (item.images && Array.isArray(item.images)) {
            item.images = item.images.map(imageUrl => {
                if (imageUrl.startsWith('https://kanajo.com/public/thread/img/')) {
                    const urlParams = new URL(imageUrl).searchParams;
                    const id = urlParams.get('id');
                    const no = urlParams.get('no');
                    if (id && no) {
                        const outputPath = path.join(outputDir, `kanajo_${id}-${no}`);
                        return new Promise((resolve, reject) => {
                            const protocol = url.parse(imageUrl).protocol === 'https:' ? https : http;
                            protocol.get(imageUrl, {
                                followAllRedirects: true,
                                maxRedirects: 5
                            }, (response) => {
                                let data = '';
                                response.on('data', (chunk) => {
                                    data += chunk;
                                });
                                response.on('end', () => {
                                    const $ = load(data);
                                    const imgSrc = $('img').attr('src');
                                    if (imgSrc) {
                                        downloadImage(imgSrc, outputPath)
                                            .then(filePath => resolve(path.relative(process.cwd(), filePath)))
                                            .catch(reject);
                                    } else {
                                        resolve(imageUrl);
                                    }
                                });
                            }).on('error', reject);
                        });
                    }
                }
                return Promise.resolve(imageUrl);
            });
            item.images = Promise.all(item.images);
        }
    });
    return Promise.all(data.map(async item => {
        if (item.images) {
            item.images = await item.images;
        }
        return item;
    }));
}

async function main() {
    const sourceDir = path.join(__dirname, '..', 'data', 'source', 'json');
    const inputPath = path.join(sourceDir, 'kanajo.json');
    const outputDir = path.join(__dirname, '..', 'data', 'source', 'image');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const data = JSON.parse(await fs.promises.readFile(inputPath, 'utf8'));
    const processedData = await processImages(data, outputDir);

    await fs.promises.writeFile(inputPath, JSON.stringify(processedData, null, 2));
    console.log(`Processed and saved: ${inputPath}`);
}

main().catch(console.error);