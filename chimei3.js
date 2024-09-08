const kuromoji = require('kuromoji');
const path = require('path');

function extractPlaces(text) {
  return new Promise((resolve, reject) => {
    const dicPath = path.resolve('node_modules/kuromoji/dict');
    const userDicPath = path.resolve('node_modules/kuromoji/dict/user-dict.csv');

    kuromoji.builder({ dicPath: dicPath, userDictionary: userDicPath }).build((err, tokenizer) => {
      if (err) {
        reject(err);
        return;
      }

      const tokens = tokenizer.tokenize(text);
      const places = tokens.filter(token => {
        return (
          (token.pos === '名詞' && token.pos_detail_1 === '固有名詞' && token.pos_detail_2 === '地域') ||
          (token.pos === '名詞' && token.pos_detail_1 === '接尾' && token.pos_detail_2 === '地域') ||
          (token.pos === '名詞' && token.pos_detail_1 === '一般' && token.surface_form === '都内')
        );
      }).map(token => token.surface_form);

      resolve(places);
    });
  });
}

// 使用例
const text = "明日は東京都新宿区で会議があります。その後、大阪府に出張し、京都市を観光します。都内では渋滞が多いです。";

extractPlaces(text)
  .then(places => {
    console.log('抽出された地名:', places);
  })
  .catch(err => {
    console.error('エラー:', err);
  });