// CoomonJS形式からES modules形式に変換してください。
// globはES modules形式に対応していないので使うのをやめます。別のものを提案してください。


import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getLatestFile(directory, extension) {
    const files = await fs.readdir(directory);
    const filteredFiles = files.filter(file => path.extname(file) === extension);
    const stats = await Promise.all(filteredFiles.map(file => fs.stat(path.join(directory, file))));
    const sortedFiles = filteredFiles.map((file, index) => ({ file, mtime: stats[index].mtime }))
                                     .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    return sortedFiles[0]?.file;
}

async function mergeAndProcessData() {
    try {
        const boardDataDir = path.join(__dirname, '..', 'data', 'contents');
        const sourceDataDir = path.join(__dirname, '..', 'data', 'source', 'json');

        // 最新の board_data_*.json ファイルを取得
        const boardDataFile = await getLatestFile(boardDataDir, '.json');
        // 最新の data/source/json/*.json ファイルを取得
        const sourceDataFile = await getLatestFile(sourceDataDir, '.json');

        if (!boardDataFile || !sourceDataFile) {
            console.error('必要なJSONファイルが見つかりません。');
            return;
        }

        const boardData = JSON.parse(await fs.readFile(path.join(boardDataDir, boardDataFile), 'utf8'));
        const sourceData = JSON.parse(await fs.readFile(path.join(sourceDataDir, sourceDataFile), 'utf8'));

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