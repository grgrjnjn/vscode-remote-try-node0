// うまくいっているように見える！

// ↓で生成したわけじゃないけどメモがわりに残しておく

// あなたは優秀なプログラマです。
// 私はLinux上で、node.jsでプログラミングしている。

// data/source/json/kanajo_*json の最新のファイルを読み込む。「JSON（抜粋）」を参照。
// 「images」の値が、「https://kanajo.com/public/thread/img/?id=*&type=comment&no=*」のパターンの時は、以下の処理をする。
// 例）
// "https://kanajo.com/public/thread/img/?id=9320735&type=comment&no=1"

// リンク先のページで画像が表示されている。
// 例）
// <img width="80%" src="http://kanajo.com/public/assets/img/bbs/00000001/ed938cfe9d93fd22fd79ea23c443a5d9.jpg?1726547483" alt="" />   
// この画像をファイルとして data/source/image/ に保存する。
// ファイル名は、URL中のid（id=9320735の部分）とno（no=1の部分）を用いて「kanajo_{id}-{no}.拡張子」とする。
// 拡張子はMIMEを適切に判断して付ける。

// 画像を保存した「images」の値は、 data/source/image/ファイル名 に変更する。

// JSONは、上書き保存する。
// これらはバッチ処理で行うため不要な非同期処理は行わずシンプルに実装する。
// 全てのコードを示せ。


const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const mime = require('mime-types');
const url = require('url');

function getLatestFile(dir, prefix) {
    const files = fs.readdirSync(dir).filter(file => file.startsWith(prefix));
    return files.sort().pop();
}

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
                const fileStream = fs.createWriteStream(filePath);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve(filePath);
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
                                    const $ = cheerio.load(data);
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
    const latestFile = getLatestFile(sourceDir, 'kanajo_');
    const inputPath = path.join(sourceDir, latestFile);
    const outputDir = path.join(__dirname, '..', 'data', 'source', 'image');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const processedData = await processImages(data, outputDir);

    fs.writeFileSync(inputPath, JSON.stringify(processedData, null, 2));
    console.log(`Processed and saved: ${inputPath}`);
}

main().catch(console.error);