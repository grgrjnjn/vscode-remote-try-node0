const stringSimilarity = require('string-similarity');

function areTextsSimilar(text1, text2, threshold = 0.9) {
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);
  
  const similarity = stringSimilarity.compareTwoStrings(normalized1, normalized2);
  
  return similarity >= threshold;
}

function normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
}



const message0 = "これから新宿で無理やりしてくれる方いませんか？\nマスク女装で穴使えませんが、それでも良ければ\n168.49.20、場所なしです";
const message1 = "サありで場所あり！高田馬場で会える人、逆アナされたい男募集！冷やかしさんはお断りです。プロフがあると返信しやすいです。Xを見て興味あったらDMください🥰";
const message2 = "高田馬場で今日会える人いますか？\nM寄りで責められるのが好き\nプロフと顔写真ください";
const message3 = "お時間ある方葛飾方面自宅来てください！エッチしまょ🩷アナル！お口します。胸無し竿小さめ完全女装娘";
const message4 = "168センチ98キロ24歳、Hカップありありニューハーフ。都内から\nお時間合えば遊んでください。\n太ってますが、良ければよろしくお願いします";
const message5 = "おなでんしませんか？\nビデオでいじめたいです☺️💗\nぺいぺい0.25確認できたらかけます！\n見せ合いっこでも🙆🏼‍♀️";
const message6 = "新宿ホテルでお手てありでお会いできる方募集してます💰\n176.67.23、ホルDカップ、アリアリ。モチモチツルスベ肌です✨️\n全身性感帯です、アナル.乳首特に感じます◎AF好きです！！\nお店にもいたのでテクなど自信あります👍🏻\n逆アナ、射精、身体に傷がつくこと❌、\n軽めは1～\n｢プロフ、やりたいこと、日時、プレイ時間と料金、（出来たら顔写真）｣\nなどを載せてご連絡ください。\nよろしくお願いします\n⚠️カカオ使えなくなりました。やり取りしてた方メールしてくれると嬉しいです🙇‍♀️\n写真は本人です、加工してない。\n他に写真は見せたりしてません、有料です。\n見たかったら画像検索してください。";
const message7 = "おなでんしませんか？\nビデオでいじめたいです☺️💗\nぺいぺい0.25確認できたらかけます！\n見せ合いっこでも🙆🏼‍♀️";
const message8 = "画像の人物ヒドンナは全て同一人物であり、ど田舎から足立区へ移住してきた田舎者で低学歴者で元介護士でハゲで３０代のモーホーです。\n目を美容整形しました添付画像１。\n\nふわっち配信者と迷惑ユーチューバーであり車で会いに行く約束をし生配信で垂れ流すよ！\n\n『 出会い系で男と会い配信で流す足立区 肥満女装 』で、検索！\n\nヒドンナは頭が弱く極悪な元介護士、施設にいる年寄りをイジメていたこともあります。";
const message9 = "これから池袋で無理やりしてくれる方いませんか？マスク女装で穴使えませんが、それでも良ければ\n168.49.20、場所なしです";

console.log(areTextsSimilar(message0, message1));
console.log(areTextsSimilar(message0, message2));
console.log(areTextsSimilar(message0, message3));
console.log(areTextsSimilar(message0, message4));
console.log(areTextsSimilar(message0, message5));
console.log(areTextsSimilar(message0, message6));
console.log(areTextsSimilar(message0, message7));
console.log(areTextsSimilar(message0, message8));
console.log(areTextsSimilar(message0, message9));
