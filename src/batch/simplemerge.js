// あなたは優秀なプログラマです。
// 私はLinux上で、node.jsとselenium（ヘッドレスモード）を用いたプログラミングをしています。

// 2つのファイルを単純にマージして
// data/content/merge_20240910102820.json
// のようなファイルを生成する。
// 出力ファイル名は、merge_yyyymmddhh24miss.jsonとする。

// マージする2つのファイルのファイル名は起動時に指定する。以下のような指定が想定される。
// data/source/json/oshioki_20240910082306.json
// data/content/merge_20240910131036.json
// data/content/board_data_20240910131401.json


// マージするファイルは以下のような内容である。

// [
//     {
//       "name": "レイラ",
//       "email": "yorunonaminamida@gmail.com",
//       "住所": "東京",
//       "年齢": "18〜24歳",
//       "ｽﾀｲﾙ": "完全女装",
//       "体型": "普通",
//       "message": "しゃぶりッコが好きなお兄さん一緒に舐めっこしよ🍌希望あれば逆アナも可能⭐️\n低身長160せんち　50きろ　Pサイズ17センチ🍌地毛ロング🖤\n後日無理です⭐︎足立区⭐︎\n足あり限定　初回は車内🚙💗\nお願いアリ募集🩷✨\n顔写メ必ずつけてね！！！\n🆖→こちらの顔写メ要求（悪用された経験アリの為）遅漏な人　不潔な人　インポな人",
//       "images": [
//         "https://oshioki24.com/board/view/4Y5ltDqwXUPlN67zXj3Hs6Agod1xYMe7",
//         "https://oshioki24.com/board/view/4Y5ltDqwXUPlN67zXj3Hs6Ag1VClSgIf"
//       ],
//       "postTime": "2024.09.10(火) 17:22",
//       "同一投稿数": 1
//     },
//     {
//       "name": "もえ",
//       "email": "shemeil10@yahoo.co.jp",
//       "住所": "東京",
//       "年齢": "18〜24歳",
//       "ｽﾀｲﾙ": "ニューハーフ",
//       "体型": "普通",
//       "message": "これから秋葉原駅近くでフェラかエッチで（タダではないです）。だいたいの背丈年齢に秋葉原駅周辺に何時頃なるかを必ず記載してください。後日今度逆アナは不可NG。駅から少し歩いた場所にひと気少ない多目的トイレと駅の改札からすぐ歩いた近くにホテルかレンタルルームがあります。車の方なら車内も可。ゴムローションあります。写真詐欺業者釣り募集ではないです。見た目容姿特徴は記載してる一切加工なしのノーマルカメラ直自撮り写真とプロフ通りです。身長163 普通標準体型51髪地毛ツインテール童顔ホル乳Fカップ　3サイズ 92ー58ー87\n先程から私の写真を無断転載し、写真は加工と言いつつ画像の通りずんぐりむっくり体型ドラム缶体型と意味不明な支離滅裂嘘の嫌がらせの書き込みと、会ってすらないのに断って大声出など実際に相手にしてないはずなのに、この前はフェラ下手でフェラだけで1取るとかとても矛盾な妨害する為の全部事実無根で嘘な書き込みなので騙されず無視しましょう。散々捨てアド複数メアドで煽りメールをやり、私が書き込みする度に被せて書き込みしてくる粘着魔のキチガイですので、間に受けず無視してください",
//       "images": [
//         "https://oshioki24.com/board/view/x95mAF3xrZ06SK3IqjwLKZQzqf6DIJEh",
//         "https://oshioki24.com/board/view/x95mAF3xrZ06SK3IqjwLKZQzu1OsXv9Z",
//         "https://oshioki24.com/board/view/x95mAF3xrZ06SK3IqjwLKZQz6OA8XTEJ"
//       ],
//       "postTime": "2024.09.10(火) 17:20",
//       "同一投稿数": 1
//     },
//     {
//       "name": "miu",
//       "email": "paipansm3@gmail.com",
//       "住所": "東京",
//       "年齢": "35〜44歳",
//       "ｽﾀｲﾙ": "完全女装",
//       "体型": "普通",
//       "message": "年上５０代半ば以上の方で、テレセと言うよりも変態的な体験談や初体験の話等をスカイフォンで聞きたいと言う方。私は162-51、昔女ホルもやってたパイパンで精液を飲まされたり、縛りや鼻フックにフィストや浣腸プレイにも感じるプレイの時は羞恥系のドMになってしまう変態性処理淫乱公衆便女です。\n深夜にメッシュ地のボディタイツや薄手のスクール水着等で鼻フックを付けられて、発展公園のトイレの個室の扉を開けられたまま知らないオジサマ達の変態性処理公衆豚便女として使われて、濃いザーメンを何人も飲まされたり、言葉責めされながらギャラリーの見てる前で小便器を舐めさせられたりもする事に感じる変態です。最近では、ホームレスの方々の洗っていない臭いオチンポをお口で掃除させられる事にも悦びを覚えるようになりました。\n変態的なプレイや濃い精液を飲ませるのがお好きな方、色々変態的な通話をしませんか？テレセはしませんが、ノリ良く話をリードしてくださる精神的に変態便女として堕としてくださるような変態的なS気のあるオジサマからのいやらしい連絡を待っています。",
//       "images": [
//         "https://oshioki24.com/board/view/GXzicTsfbxEKPD2eBOX3fNO2iv2df03N",
//         "https://oshioki24.com/board/view/GXzicTsfbxEKPD2eBOX3fNO2w1EXj00w"
//       ],
//       "postTime": "2024.09.10(火) 17:18",
//       "同一投稿数": 1
//     }
// ]


const fs = require('fs').promises;
const path = require('path');

async function mergeJsonFiles(file1, file2) {
    try {
        // 入力ファイルのパスを構築
        const inputPath1 = path.resolve(__dirname, '..', '..', file1);
        const inputPath2 = path.resolve(__dirname, '..', '..', file2);

        // JSONファイルを読み込む
        const data1 = JSON.parse(await fs.readFile(inputPath1, 'utf8'));
        const data2 = JSON.parse(await fs.readFile(inputPath2, 'utf8'));

        // データをマージ
        const mergedData = [...data1, ...data2];

        // 出力ファイル名を生成
        const now = new Date();
        const timestamp = now.getFullYear() +
                          ('0' + (now.getMonth() + 1)).slice(-2) +
                          ('0' + now.getDate()).slice(-2) +
                          ('0' + now.getHours()).slice(-2) +
                          ('0' + now.getMinutes()).slice(-2) +
                          ('0' + now.getSeconds()).slice(-2);
        const outputFileName = `merge_${timestamp}.json`;

        // 出力ファイルのパスを構築
        const outputPath = path.join(__dirname, '..', '..', 'data', 'content', outputFileName);

        // マージしたデータを新しいJSONファイルに書き込む
        await fs.writeFile(outputPath, JSON.stringify(mergedData, null, 2));

        console.log(`マージが完了しました。出力ファイル: ${outputPath}`);
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

// コマンドライン引数からファイル名を取得
const [file1, file2] = process.argv.slice(2);

if (!file1 || !file2) {
    console.error('使用方法: node script.js <file1> <file2>');
    process.exit(1);
}

mergeJsonFiles(file1, file2);