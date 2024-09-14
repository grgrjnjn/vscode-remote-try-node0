// あなたは優秀なプログラマです。
// 私はLinux上で、node.jsとselenium（ヘッドレスモード）を用いたプログラミングをしています。


// 掲示板の投稿記事をJSONにしたファイルから、投稿記事の重複を排除するプログラムを作成する。
// 読み込むファイル
// data/content/merge_20240910131036.json
// ファイル名は起動時に指定する。
// 出力ファイル
// data/content/board_data_20240910112726.json
// ファイル名は、board_data_YYYYmmddhh24miss.json とする。

// emailが同じ場合は重複と判定し、postTimeが新しい方を残し、古い方を破棄する。同一投稿数は合計値に更新する。
// 出力時には、postTimeの降順にソートする。

// ###JSONファイル（例）
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
//     },
//     {
//       "name": "三",
//       "email": "ricponic@gmail.com",
//       "住所": "東京",
//       "年齢": "18〜24歳",
//       "ｽﾀｲﾙ": "下着女装",
//       "体型": "細マッチョ",
//       "message": "女装してみたいです\n女装経験ある方と一緒に女装サロンとかバーに行って仲良くなりたいです\n誰もいない公園とかでカマレズ羞恥プレイとかしたい",
//       "images": [],
//       "postTime": "2024.09.10(火) 17:17",
//       "同一投稿数": 1
//     },
//     {
//       "name": "りな",
//       "email": "love33rlna@docomo.ne.jp",
//       "住所": "東京",
//       "年齢": "35〜44歳",
//       "ｽﾀｲﾙ": "ニューハーフ",
//       "体型": "普通",
//       "message": "エッチしましょう場所アリで台東区にすんでます\n黒肌のニューハーフです\n技術は、エッチ好きなのでそれなりにあります",
//       "images": [
//         "https://oshioki24.com/board/view/xnsh56dkJoqkNwtvEEqdoZQWaYOl2KPH",
//         "https://oshioki24.com/board/view/xnsh56dkJoqkNwtvEEqdoZQWm4BukhN1"
//       ],
//       "postTime": "2024.09.10(火) 17:16",
//       "同一投稿数": 1
//     },
//     {
//       "name": "みみ",
//       "email": "mimichamketuman@yahoo.co.jp",
//       "住所": "東京",
//       "年齢": "25〜34歳",
//       "ｽﾀｲﾙ": "完全女装",
//       "体型": "普通",
//       "message": "今日か明日、渋谷のビデオボックスで\n条件有りでお会いできる方メールください❣️\n169/55/27\n18センチ太め\n逆アナと生AFはできないです🥺\n簡単なプロフ乗せてメールください❣️\nリピさんもメールください🥰\nあと、返信来ないなという方は、ヤフーメールを受信できるように設定してください💦",
//       "images": [
//         "https://oshioki24.com/board/view/L02HmP9KRHZzIsLaaT96Wp6gJZ5gpGb3",
//         "https://oshioki24.com/board/view/L02HmP9KRHZzIsLaaT96Wp6gWICtXfuI",
//         "https://oshioki24.com/board/view/L02HmP9KRHZzIsLaaT96Wp6gbCWpkIMX"
//       ],
//       "postTime": "2024.09.10(火) 17:16",
//       "同一投稿数": 1
//     },
//     {
//       "name": "まな",
//       "email": "hndto_tk@yahoo.co.jp",
//       "住所": "東京",
//       "年齢": "25〜34歳",
//       "ｽﾀｲﾙ": "完全女装",
//       "体型": "普通",
//       "message": "場所あるので、これから\nフェラどうですか？\n地毛明るめロング167-66\n江戸川区、よろしくです～",
//       "images": [],
//       "postTime": "2024.09.10(火) 17:14",
//       "同一投稿数": 1
//     },
    // {
    //   "name": "ちひろ",
    //   "email": "sweetyappi@hotmail.com",
    //   "住所": "東京",
    //   "年齢": "35〜44歳",
    //   "ｽﾀｲﾙ": "完全女装",
    //   "体型": "普通",
    //   "message": "こんにちは。お会いできるといいな。\n肉体鍛えてるスポーツ系イクメンさん、学生さん、女性に飽きて新しい刺激を求めてる方入れば是非試してみてね！パンプアップ中で性欲抑えきれなくて吐口探してるノンケさん。もちろん無料ですが、プロフと写はよろしくね。都内、場所あり。",
    //   "images": [
    //     "https://oshioki24.com/board/view/Ew9zdmfeFBAGQc3aZhOgJDmC1UAxcMSl"
    //   ],
    //   "postTime": "2024.09.10(火) 17:11",
    //   "同一投稿数": 1
    // },
//     {
//       "name": "アオミー",
//       "email": "m3h2-aommy@yahoo.co.jp",
//       "住所": "東京",
//       "年齢": "18〜24歳",
//       "ｽﾀｲﾙ": "ニューハーフ",
//       "体型": "普通",
//       "message": "タイから来たニューハーフです\n上野のホテルにステイしています\nい、ち、ごオーケーなひとメールください",
//       "images": [
//         "https://oshioki24.com/board/view/p30Itmp4oBfgx0q6M0fT4NxcUmzHS2Tn",
//         "https://oshioki24.com/board/view/p30Itmp4oBfgx0q6M0fT4NxcoAd7Rzsb",
//         "https://oshioki24.com/board/view/p30Itmp4oBfgx0q6M0fT4NxckSuyBZqA"
//       ],
//       "postTime": "2024.09.10(火) 17:11",
//       "同一投稿数": 1
//     },
//     {
//       "name": "ほたる",
//       "email": "nh.hotaru@gmail.com",
//       "住所": "東京",
//       "年齢": "25〜34歳",
//       "ｽﾀｲﾙ": "ニューハーフ",
//       "体型": "普通",
//       "message": "新橋でオイルたっぷり使った密着オイルマッサージを受けたいお兄様ご連絡待ってます♡",
//       "images": [
//         "https://oshioki24.com/board/view/UVc7qStnUu9xMD9Iom357R8Vzpy5Y1Ox"
//       ],
//       "postTime": "2024.09.10(火) 17:09",
//       "同一投稿数": 1
//     }
//   ]


const fs = require('fs').promises;
const path = require('path');

async function removeDuplicatesAndSort(inputFileName) {
    try {
        // 入力ファイルのパスを構築
        const inputPath = path.join(__dirname, '..', '..', 'data', 'content', inputFileName);

        // JSONファイルを読み込む
        const data = JSON.parse(await fs.readFile(inputPath, 'utf8'));

        // 重複を排除しマージ処理
        const mergedData = {};

        for (const item of data) {
            const email = item.email;
            if (!mergedData[email] || new Date(item.postTime) > new Date(mergedData[email].postTime)) {
                if (mergedData[email]) {
                    item.同一投稿数 += mergedData[email].同一投稿数;
                }
                mergedData[email] = item;
            } else {
                mergedData[email].同一投稿数 += item.同一投稿数;
            }
        }

        // オブジェクトを配列に変換し、postTimeでソート
        const sortedData = Object.values(mergedData).sort((a, b) => 
            new Date(b.postTime) - new Date(a.postTime)
        );

        // 出力ファイル名を生成
        const now = new Date();
        const timestamp = now.getFullYear() +
                          ('0' + (now.getMonth() + 1)).slice(-2) +
                          ('0' + now.getDate()).slice(-2) +
                          ('0' + now.getHours()).slice(-2) +
                          ('0' + now.getMinutes()).slice(-2) +
                          ('0' + now.getSeconds()).slice(-2);
        const outputFileName = `board_data_${timestamp}.json`;

        // 出力ファイルのパスを構築
        const outputPath = path.join(__dirname, '..', '..', 'data', 'content', outputFileName);

        // ソートされたデータを新しいJSONファイルに書き込む
        await fs.writeFile(outputPath, JSON.stringify(sortedData, null, 2));

        console.log(`重複排除とソートが完了しました。出力ファイル: ${outputPath}`);
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

// コマンドライン引数からファイル名を取得
const inputFileName = process.argv[2];

if (!inputFileName) {
    console.error('使用方法: node script.js <input_file_name>');
    process.exit(1);
}

removeDuplicatesAndSort(inputFileName);