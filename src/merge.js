const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const glob = require('glob');

async function getLatestFile(pattern) {
    const files = glob.sync(pattern);
    const stats = await Promise.all(files.map(file => fs.stat(file)));
    const sortedFiles = files.map((file, index) => ({ file, mtime: stats[index].mtime }))
                            .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    return sortedFiles[0]?.file;
}

async function mergeAndProcessData() {
    try {
        // 最新の board_data_*.json ファイルを取得
        const boardDataFile = await getLatestFile(path.join(__dirname, '..', 'data', 'contents', 'board_data_*.json'));
        // 最新の data/source/json/*.json ファイルを取得
        const sourceDataFile = await getLatestFile(path.join(__dirname, '..', 'data', 'source', 'json', '*.json'));

        if (!boardDataFile || !sourceDataFile) {
            console.error('必要なJSONファイルが見つかりません。');
            return;
        }

        const boardData = JSON.parse(await fs.readFile(boardDataFile, 'utf8'));
        const sourceData = JSON.parse(await fs.readFile(sourceDataFile, 'utf8'));

        const mergedData = {};
        const emailMap = new Map(boardData.map(item => [item.email, item]));

        for (const item of [...boardData, ...sourceData]) {
            const email = item.email;
            if (!mergedData[email] || new Date(item.postTime) > new Date(mergedData[email].postTime)) {
                if (mergedData[email]) {
                    item.numberOfSimilarPosts = (item.numberOfSimilarPosts || 0) + mergedData[email].numberOfSimilarPosts;
                } else {
                    item.numberOfSimilarPosts = 1;
                }
                mergedData[email] = item;
            } else {
                mergedData[email].numberOfSimilarPosts += 1;
            }
        }

        // postTimeの降順でソート
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
        const outputPath = path.join(__dirname, '..', 'data', 'contents', outputFileName);

        // ソートされたデータを新しいJSONファイルに書き込む
        await fs.writeFile(outputPath, JSON.stringify(sortedData, null, 2));

        console.log(`マージ、重複排除、ソートが完了しました。出力ファイル: ${outputPath}`);
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

mergeAndProcessData();