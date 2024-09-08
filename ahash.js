const sharp = require('sharp');
const path = require('path');

async function getImageHash(imagePath) {
  const buffer = await sharp(imagePath)
    .resize(8, 8, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer();

  const pixels = Array.from(buffer);
  const avgPixelValue = pixels.reduce((sum, pixel) => sum + pixel, 0) / pixels.length;
  
  return pixels.map(pixel => (pixel > avgPixelValue ? 1 : 0)).join('');
}

async function compareImages(image1Path, image2Path) {
  try {
    const [hash1, hash2] = await Promise.all([
      getImageHash(image1Path),
      getImageHash(image2Path)
    ]);

    const distance = hammingDistance(hash1, hash2);
    const similarity = 100 - (distance / 64 * 100);

    return similarity;
  } catch (error) {
    console.error('Error comparing images:', error);
    return null;
  }
}

function hammingDistance(hash1, hash2) {
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  return distance;
}

// 使用例
const image1Path = path.join(__dirname, 'image.jpg');
const image2Path = path.join(__dirname, 'image2.jpg');

compareImages(image1Path, image2Path)
  .then(similarity => {
    if (similarity !== null) {
      console.log(`画像の類似度: ${similarity.toFixed(2)}%`);
      if (similarity > 90) {
        console.log('画像は非常に類似しています。');
      } else if (similarity > 70) {
        console.log('画像はある程度類似しています。');
      } else {
        console.log('画像の類似性は低いです。');
      }
    }
  })
  .catch(error => console.error('比較中にエラーが発生しました:', error));