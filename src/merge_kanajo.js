const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getLatestFile(pattern) {
    const files = glob.sync(pattern);
    return files.sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime())[0];
}

function mergeData(boardData, kanajoData) {
    const mergedData = [...boardData];
    const emailMap = new Map(boardData.map(item => [item.email, item]));

    for (const kanajoItem of kanajoData) {
        const existingItem = emailMap.get(kanajoItem.email);

        if (existingItem) {
            if (kanajoItem.postTime === existingItem.postTime) {
                // 同じemailとpostTimeの場合、kanajoのデータを破棄
                continue;
            } else if (new Date(kanajoItem.postTime) > new Date(existingItem.postTime)) {
                // kanajoの方が新しい場合、上書きしてカウントアップ
                Object.assign(existingItem, kanajoItem);
                existingItem.numberOfSimilarPosts = (existingItem.numberOfSimilarPosts || 0) + 1;
            }
            // kanajoの方が古い場合は何もしない
        } else {
            // 新しいデータを追加
            kanajoItem.numberOfSimilarPosts = 1;
            mergedData.push(kanajoItem);
        }
    }

    // postTimeの降順でソート
    return mergedData.sort((a, b) => new Date(b.postTime) - new Date(a.postTime));
}

function main() {
    const boardDataFile = getLatestFile(path.join(__dirname, '..', 'data', 'contents', 'board_data_*.json'));
    const kanajoDataFile = getLatestFile(path.join(__dirname, '..', 'data', 'source', 'json', 'kanajo_*.json'));

    if (!boardDataFile || !kanajoDataFile) {
        console.error('必要なJSONファイルが見つかりません。');
        return;
    }

    const boardData = JSON.parse(fs.readFileSync(boardDataFile, 'utf8'));
    const kanajoData = JSON.parse(fs.readFileSync(kanajoDataFile, 'utf8'));

    const mergedData = mergeData(boardData, kanajoData);

    const timestamp = new Date().toISOString().replace(/[-T:]/g, '').slice(0, 14);
    const outputFileName = `board_data_${timestamp}.json`;
    const outputPath = path.join(__dirname, '..', 'data', 'contents', outputFileName);

    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
    console.log(`マージが完了しました。出力ファイル: ${outputPath}`);
}

main();