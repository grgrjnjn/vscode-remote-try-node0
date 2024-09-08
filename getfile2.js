const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function downloadAndResizeImage(url, outputPath) {
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download image. Status Code: ${response.statusCode}`);
      return;
    }

    const contentType = response.headers['content-type'];
    let extension = '.jpg'; // デフォルトの拡張子

    if (contentType.includes('png')) {
      extension = '.png';
    } else if (contentType.includes('gif')) {
      extension = '.gif';
    } else if (contentType.includes('webp')) {
      extension = '.webp';
    }

    const fileName = `image2${extension}`;
    const fullPath = path.join(outputPath, fileName);

    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
      const buffer = Buffer.concat(chunks);
      
      // 画像のサイズを確認
      sharp(buffer)
        .metadata()
        .then(metadata => {
          const sizeThreshold = 10; // 10KB
          const imageSize = buffer.length / 1024; // バッファのサイズをKBに変換

          // 縮小するかしないかの判断結果を出力
          if (imageSize > sizeThreshold) {
            console.log(`画像は${imageSize.toFixed(2)}KBで、リサイズが必要です。`);
            
            // 画像を縮小
            const scaleFactor = Math.sqrt(sizeThreshold / imageSize);
            const newWidth = Math.round(metadata.width * scaleFactor);
            const newHeight = Math.round(metadata.height * scaleFactor);

            sharp(buffer)
              .resize(newWidth, newHeight)
              .toFile(fullPath, (err, info) => {
                if (err) {
                  console.error(`Error resizing image: ${err.message}`);
                } else {
                  console.log(`Image resized and saved as ${fullPath}`);
                  console.log(`New size: ${info.width}x${info.height}`);
                }
              });
          } else {
            console.log(`画像は${imageSize.toFixed(2)}KBで、リサイズは不要です。`);
            // 縮小不要の場合はそのまま保存
            fs.writeFile(fullPath, buffer, (err) => {
              if (err) {
                console.error(`Error saving image: ${err.message}`);
              } else {
                console.log(`Image saved as ${fullPath}`);
              }
            });
          }
        })
        .catch(err => {
          console.error(`Error processing image: ${err.message}`);
        });
    });
  }).on('error', (error) => {
    console.error(`Error downloading image: ${error.message}`);
  });
}

// 使用例
const imageUrl = 'https://oshioki24.com/board/view/sIP1cFvO6LmfaZ0ip7Sgw8B3gGL4Wszl';
const outputDirectory = '/workspaces/vscode-remote-try-node';

downloadAndResizeImage(imageUrl, outputDirectory);