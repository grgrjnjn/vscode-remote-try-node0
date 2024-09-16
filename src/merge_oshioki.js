// あなたは優秀なプログラマです。
// 私はLinux上でnode.jsを用いたプログラミングをしています。
// 以下のコードを作成してください。

// data/contents/board_data_*.jsonの最新のファイルを読み込む。
// data/source/json/oshioki_*.jsonの最新のファイルを読み込む。
// 下記ルールに従って、board_data_*.jsonに対してoshioki_*.jsonをマージして、
// data/contents/board_data_YYYYmmddhh24miss.json
// として保存する。

// マージのルール
// ・emailとpostTimeが一致する場合は、oshioki_*.jsonの方を破棄する
// ・emailが一致、postTimeがoshioki_*.jsonの方が新しい場合は、oshioki_*.jsonの値で上書きして、numberOfSimilarPostsをカウントアップする
// ・emailが一致、postTimeがoshioki_*.jsonの方が古い場合は、oshioki_*.jsonの方は破棄する。board_data_*.jsonはそのままとする。
// ・emailが一致しない場合は、oshioki_*.jsonに「"numberOfSimilarPosts": 1」を加えて、追加する
// ・emailが一致しないboard_data_*.jsonはそのままとする


const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getLatestFile(pattern) {
    const files = glob.sync(pattern);
    return files.sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime())[0];
}

function mergeData(boardData, oshiokiData) {
    const mergedData = [...boardData];
    const emailMap = new Map(boardData.map(item => [item.email, item]));

    for (const oshiokiItem of oshiokiData) {
        const existingItem = emailMap.get(oshiokiItem.email);

        if (existingItem) {
            if (oshiokiItem.postTime === existingItem.postTime) {
                // 同じemailとpostTimeの場合、oshiokiのデータを破棄
                continue;
            } else if (new Date(oshiokiItem.postTime) > new Date(existingItem.postTime)) {
                // oshiokiの方が新しい場合、上書きしてカウントアップ
                Object.assign(existingItem, oshiokiItem);
                existingItem.numberOfSimilarPosts = (existingItem.numberOfSimilarPosts || 0) + 1;
            }
            // oshiokiの方が古い場合は何もしない
        } else {
            // 新しいデータを追加
            oshiokiItem.numberOfSimilarPosts = 1;
            mergedData.push(oshiokiItem);
        }
    }

    return mergedData.sort((a, b) => new Date(b.postTime) - new Date(a.postTime));
}

function main() {
    const boardDataFile = getLatestFile(path.join(__dirname, '..', 'data', 'contents', 'board_data_*.json'));
    const oshiokiDataFile = getLatestFile(path.join(__dirname, '..', 'data', 'source', 'json', 'oshioki_*.json'));

    if (!boardDataFile || !oshiokiDataFile) {
        console.error('必要なJSONファイルが見つかりません。');
        return;
    }

    const boardData = JSON.parse(fs.readFileSync(boardDataFile, 'utf8'));
    const oshiokiData = JSON.parse(fs.readFileSync(oshiokiDataFile, 'utf8'));

    const mergedData = mergeData(boardData, oshiokiData);

    const timestamp = new Date().toISOString().replace(/[-T:]/g, '').slice(0, 14);
    const outputFileName = `board_data_${timestamp}.json`;
    const outputPath = path.join(__dirname, '..', 'data', 'contents', outputFileName);

    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
    console.log(`マージが完了しました。出力ファイル: ${outputPath}`);
}

main();