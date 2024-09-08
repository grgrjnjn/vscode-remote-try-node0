const kuromoji = require('kuromoji');

function extractPlaces(text) {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
      if (err) {
        reject(err);
        return;
      }

      const tokens = tokenizer.tokenize(text);
      const places = tokens.filter(token => {
        // 地名と思われる品詞を抽出
        return (
          (token.pos === '名詞' && token.pos_detail_1 === '固有名詞' && token.pos_detail_2 === '地域') ||
          (token.pos === '名詞' && token.pos_detail_1 === '固有名詞' && token.pos_detail_2 === '一般' && token.pos_detail_3 === '地名') ||
          (token.pos === '名詞' && token.pos_detail_1 === '接尾' && token.pos_detail_2 === '地域')
        );
      }).map(token => token.surface_form);

      resolve(places);
    });
  });
}

// 使用例
// const text = "明日は東京都新宿区で会議があります。その後、大阪府に出張し、京都市を観光します。";

// const text = "これから新宿で無理やりしてくれる方いませんか？\nマスク女装で穴使えませんが、それでも良ければ\n168.49.20、場所なしです";
// const text = "サありで場所あり！高田馬場で会える人、逆アナされたい男募集！冷やかしさんはお断りです。プロフがあると返信しやすいです。Xを見て興味あったらDMください🥰";
// const text = "高田馬場で今日会える人いますか？\nM寄りで責められるのが好き\nプロフと顔写真ください";
// const text = "お時間ある方葛飾方面自宅来てください！エッチしまょ🩷アナル！お口します。胸無し竿小さめ完全女装娘";
const text = "168センチ98キロ24歳、Hカップありありニューハーフ。都内から\nお時間合えば遊んでください。\n太ってますが、良ければよろしくお願いします";
// const text = "おなでんしませんか？\nビデオでいじめたいです☺️💗\nぺいぺい0.25確認できたらかけます！\n見せ合いっこでも🙆🏼‍♀️";
// const text = "新宿ホテルでお手てありでお会いできる方募集してます💰\n176.67.23、ホルDカップ、アリアリ。モチモチツルスベ肌です✨️\n全身性感帯です、アナル.乳首特に感じます◎AF好きです！！\nお店にもいたのでテクなど自信あります👍🏻\n逆アナ、射精、身体に傷がつくこと❌、\n軽めは1～\n｢プロフ、やりたいこと、日時、プレイ時間と料金、（出来たら顔写真）｣\nなどを載せてご連絡ください。\nよろしくお願いします\n⚠️カカオ使えなくなりました。やり取りしてた方メールしてくれると嬉しいです🙇‍♀️\n写真は本人です、加工してない。\n他に写真は見せたりしてません、有料です。\n見たかったら画像検索してください。";
// const text = "おなでんしませんか？\nビデオでいじめたいです☺️💗\nぺいぺい0.25確認できたらかけます！\n見せ合いっこでも🙆🏼‍♀️";
// const text = "画像の人物ヒドンナは全て同一人物であり、ど田舎から足立区へ移住してきた田舎者で低学歴者で元介護士でハゲで３０代のモーホーです。\n目を美容整形しました添付画像１。\n\nふわっち配信者と迷惑ユーチューバーであり車で会いに行く約束をし生配信で垂れ流すよ！\n\n『 出会い系で男と会い配信で流す足立区 肥満女装 』で、検索！\n\nヒドンナは頭が弱く極悪な元介護士、施設にいる年寄りをイジメていたこともあります。";
// const text = "これから池袋で無理やりしてくれる方いませんか？マスク女装で穴使えませんが、それでも良ければ\n168.49.20、場所なしです";



extractPlaces(text)
  .then(places => {
    console.log('抽出された地名:', places);
  })
  .catch(err => {
    console.error('エラー:', err);
  });