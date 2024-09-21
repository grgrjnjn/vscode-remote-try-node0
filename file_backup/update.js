// より明瞭に、よりシンプルな実装にするための提案をください。
// 処理内容は一切変更しません。処理内容は変わらないように注意してください。


// update(tareget, source)
//     target: 更新対象となるデータセット。
//     source: 更新情報を提供するデータセット。

// 実装が誤っているので修正してください。
// updateのルール
// ・targetのemailとsourceのemailが一致、かつ、targetのpostTimeとsourceのpostTimeが一致する場合、そのsourceのitemは破棄する。
// ・targetのemailとsourceのemailが一致、かつ、targetのpostTimeとsourceのpostTimeが一致しない場合、targetのnumberOfSimilarPostsをカウントアップし、それ以外の項目をsourceの値で上書きする。
// ・targetのemailとsourceのemailが一致しない場合、numberOfSimilarPostsを1にセットしたsourceのitemをtargetに追加する。

// updateAndProcessDataの結果の保存の部分少し気になります。より明瞭に、よりシンプルな実装にすべく提案をお願いします。

// update.js
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOARD_DATA_DIR = path.join(__dirname, '..', 'data', 'contents');
const SOURCE_DATA_DIR = path.join(__dirname, '..', 'data', 'source', 'json');
const BOARD_DATA_PREFIX = 'board_data_';
const JSON_EXT = '.json';

async function readJsonFile(filePath) {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}

async function writeJsonFile(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function getLatestBoardDataFile() {
    const files = await fs.readdir(BOARD_DATA_DIR);
    return files
        .filter(file => file.startsWith(BOARD_DATA_PREFIX) && file.endsWith(JSON_EXT))
        .sort()
        .pop();
}

function updateData(targetData, sourceData) {
    const updatedData = {};

    // まず、すべてのtargetDataをupdatedDataに追加
    for (const item of targetData) {
        updatedData[item.email] = { ...item };
    }

    for (const sourceItem of sourceData) {
        const email = sourceItem.email;
        const targetItem = updatedData[email];

        if (targetItem) {
            // targetのemailとsourceのemailが一致する場合
            if (targetItem.postTime !== sourceItem.postTime) {
                // postTimeが一致しない場合
                updatedData[email] = {
                    ...sourceItem,
                    numberOfSimilarPosts: (targetItem.numberOfSimilarPosts || 1) + 1
                };
            }
            // postTimeが一致する場合はそのsourceのitemを破棄する（何もしない）
        } else {
            // targetのemailとsourceのemailが一致しない場合
            updatedData[email] = {
                ...sourceItem,
                numberOfSimilarPosts: 1
            };
        }
    }

    return Object.values(updatedData).sort((a, b) => new Date(b.postTime) - new Date(a.postTime));
}

async function readBoardData() {
    const latestBoardDataFile = await getLatestBoardDataFile();
    if (!latestBoardDataFile) {
        throw new Error('必要なboard_data_*.jsonファイルが見つかりません。');
    }
    return await readJsonFile(path.join(BOARD_DATA_DIR, latestBoardDataFile));
}

async function readAllSourceData() {
    const sourceFiles = await fs.readdir(SOURCE_DATA_DIR);
    const jsonFiles = sourceFiles.filter(file => file.endsWith(JSON_EXT));
    const allSourceData = await Promise.all(
        jsonFiles.map(file => readJsonFile(path.join(SOURCE_DATA_DIR, file)))
    );
    return allSourceData.flat();
}

function generateTimestamp() {
    return new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
}

async function saveUpdatedData(data) {
    const timestamp = generateTimestamp();
    const fileName = `${BOARD_DATA_PREFIX}${timestamp}${JSON_EXT}`;
    const filePath = path.join(BOARD_DATA_DIR, fileName);
    
    await writeJsonFile(filePath, data);
    return filePath;
}
async function updateAndProcessData() {
    const targetData = await readBoardData();
    const sourceData = await readAllSourceData();
    const updatedData = updateData(targetData, sourceData);
    
    const outputPath = await saveUpdatedData(updatedData);
    console.log(`更新、重複排除、ソートが完了しました。出力ファイル: ${outputPath}`);
}

updateAndProcessData().catch(error => {
    console.error('処理中にエラーが発生しました:', error);
    process.exit(1);
});