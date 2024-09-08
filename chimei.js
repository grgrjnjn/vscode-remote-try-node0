const kuromoji = require('kuromoji');
const path = require('path');

// よく使われる地名のリスト
const commonPlaces = ['都内', '渋谷', '新宿', '池袋', '横浜', '名古屋', '大阪', '京都', '神戸'];

function extractPlaces(text) {
  return new Promise((resolve, reject) => {
    const dicPath = path.resolve('node_modules/kuromoji/dict');
    const userDicPath = path.resolve('user-dictionary.csv'); // ユーザー辞書のパス

    kuromoji.builder({ dicPath: dicPath, userDictionary: userDicPath }).build((err, tokenizer) => {
      if (err) {
        reject(err);
        return;
      }

      const tokens = tokenizer.tokenize(text);
      const places = tokens.filter(token => 
        (token.pos === '名詞' && token.pos_detail_1 === '固有名詞' && token.pos_detail_2 === '地域') ||
        (token.pos === '名詞' && token.pos_detail_1 === '固有名詞' && token.pos_detail_2 === '一般' && token.pos_detail_3 === '地名') ||
        (token.pos === '名詞' && token.pos_detail_1 === '一般' && ['都', '道', '府', '県', '市', '区', '町', '村'].includes(token.surface_form)) ||
        (token.pos === '名詞' && commonPlaces.includes(token.surface_form)) // 事前定義リストとの照合
      ).map(token => token.surface_form);

      resolve(places);
    });
  });
}

// 使用例
const text = "東京都新宿区にある東京タワーは有名な観光スポットです。大阪府や京都市も人気があります。都内や渋谷でショッピングを楽しむこともできます。";

extractPlaces(text)
  .then(places => {
    console.log('抽出された地名:', places);
  })
  .catch(err => {
    console.error('エラー:', err);
  });