const kuromoji = require('kuromoji');
const natural = require('natural');

function extractPlaces(text) {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
      if (err) {
        reject(err);
        return;
      }

      const tokens = tokenizer.tokenize(text);
      const words = tokens.map(token => token.surface_form);

      const language = "ja";
      const classifier = new natural.BayesClassifier();

      // 地名に関連する特徴を学習させる
      classifier.addDocument(['東京', '都'], 'place');
      classifier.addDocument(['大阪', '府'], 'place');
      classifier.addDocument(['京都', '市'], 'place');
      // 他の地名パターンも追加

      classifier.train();

      const places = words.filter(word => {
        return classifier.classify(word) === 'place';
      });

      resolve(places);
    });
  });
}

// 使用例
const text = "明日は東京都新宿区で会議があります。その後、大阪府に出張します。";
extractPlaces(text)
  .then(places => console.log('抽出された地名:', places))
  .catch(err => console.error('エラー:', err));