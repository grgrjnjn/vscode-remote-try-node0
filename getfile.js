const https = require('https');
const fs = require('fs');
const path = require('path');

function downloadImage(url, outputPath) {
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

    const fileName = `image${extension}`;
    const fullPath = path.join(outputPath, fileName);

    const fileStream = fs.createWriteStream(fullPath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Image downloaded and saved as ${fullPath}`);
    });
  }).on('error', (error) => {
    console.error(`Error downloading image: ${error.message}`);
  });
}

// 使用例
const imageUrl = 'https://oshioki24.com/board/view/sIP1cFvO6LmfaZ0ip7Sgw8B3gGL4Wszl';
const outputDirectory = '/workspaces/vscode-remote-try-node';

downloadImage(imageUrl, outputDirectory);