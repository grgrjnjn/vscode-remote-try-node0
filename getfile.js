const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { fileTypeFromBuffer } = require('file-type');

async function downloadAndSaveImage(url) {
  try {
    // URLからファイルをダウンロード
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    // ファイルタイプを判定
    const type = await fileTypeFromBuffer(buffer);

    if (type && ['image/gif', 'image/jpeg', 'image/png'].includes(type.mime)) {
      // ファイル名を生成（URLの最後の部分を使用）
      const originalFileName = path.basename(url);
      let extension;
      switch (type.mime) {
        case 'image/gif':
          extension = '.gif';
          break;
        case 'image/jpeg':
          extension = '.jpg';
          break;
        case 'image/png':
          extension = '.png';
          break;
      }
      const fileName = `${originalFileName}${extension}`;

      // ファイルを保存
      await fs.writeFile(fileName, buffer);
      console.log(`ファイルを保存しました: ${fileName}`);
      return fileName;
    } else {
      console.log('サポートされていない画像形式またはファイルタイプです。');
      return null;
    }
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    return null;
  }
}

// 使用例
async function main() {
  const url = 'https://oshioki24.com/board/view/T8zVuaczhtgwpdMHV6QMw9voFP8aArqu';
  const result = await downloadAndSaveImage(url);
  if (result) {
    console.log(`ファイルが正常に保存されました: ${result}`);
  } else {
    console.log('ファイルの保存に失敗しました。');
  }
}

main();