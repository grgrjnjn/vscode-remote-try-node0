// update.jsをベースに、updateAndProcessDataをupdateAndPublishedに変更して、published2.jsをマージしたい。

// // updateAndPublished
// async function updateAndPublished() {
//     const targetData = await readBoardData();
//     const sourceData = await readAllSourceData();
//     const updatedData = updateData(targetData, sourceData);
    
//     const outputPath = await saveUpdatedData(updatedData);
//     console.log(`更新、重複排除、ソートが完了しました。出力ファイル: ${outputPath}`);

//     // postTimeが24時間以内の記事だけ残すフィルタ関数にかける
//     let filteredData = filterRecentPosts(updatedData);

//     // ブラックリストに該当する記事をフィルタする関数にかける
//     const blacklist = await readBlacklist();
//     filteredData = filterBlacklistedPosts(filteredData, blacklist);

//     // public/board_data.jsonとして書き出す
//     await fs.writeFile(OUTPUT_PATH, JSON.stringify(filteredData, null, 2));

//     console.log(`処理が完了しました。出力ファイル: ${OUTPUT_PATH}`);
// }


// updateAndPublished().catch(error => {
//     console.error('処理中にエラーが発生しました:', error);
//     process.exit(1);
// });


data/contents/board_data_*.json の最新版を読み込むのではなく、data/contents/board_data.json を読み込むように変更します。
updateの結果も data/contents/board_data.json を上書きをするように変更します。
それ以外は一切変更しないでください。それ以外は一切変更しないでください。
変更後の全てのコードを提示してください。


import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOARD_DATA_DIR = path.join(__dirname, '..', 'data', 'contents');
const SOURCE_DATA_DIR = path.join(__dirname, '..', 'data', 'source', 'json');
const BLACKLIST_PATH = path.join(__dirname, '..', 'data', 'blacklist.list');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'board_data.json');
const BOARD_DATA_PREFIX = 'board_data_';
const JSON_EXT = '.json';
const HOURS_LIMIT = 24;

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

    for (const item of targetData) {
        updatedData[item.email] = { ...item };
    }

    for (const sourceItem of sourceData) {
        const email = sourceItem.email;
        const targetItem = updatedData[email];

        if (targetItem) {
            if (targetItem.postTime !== sourceItem.postTime) {
                updatedData[email] = {
                    ...sourceItem,
                    numberOfSimilarPosts: (targetItem.numberOfSimilarPosts || 1) + 1
                };
            }
        } else {
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

async function readBlacklist() {
    const content = await fs.readFile(BLACKLIST_PATH, 'utf8');
    return content.split('\n').filter(email => email.trim());
}

function filterRecentPosts(data) {
    const now = new Date();
    return data.filter(item => {
        const postTime = new Date(item.postTime.replace(/\(.\)/, ''));
        const hoursDiff = (now - postTime) / (1000 * 60 * 60);
        return hoursDiff <= HOURS_LIMIT;
    });
}

function filterBlacklistedPosts(data, blacklist) {
    return data.filter(item => !blacklist.includes(item.email));
}

async function updateAndPublished() {
    try {
        const targetData = await readBoardData();
        const sourceData = await readAllSourceData();
        const updatedData = updateData(targetData, sourceData);
        
        const outputPath = await saveUpdatedData(updatedData);
        console.log(`更新、重複排除、ソートが完了しました。出力ファイル: ${outputPath}`);

        // postTimeが24時間以内の記事だけ残すフィルタ関数にかける
        let filteredData = filterRecentPosts(updatedData);

        // ブラックリストに該当する記事をフィルタする関数にかける
        const blacklist = await readBlacklist();
        filteredData = filterBlacklistedPosts(filteredData, blacklist);

        // public/board_data.jsonとして書き出す
        await writeJsonFile(OUTPUT_PATH, filteredData);

        console.log(`処理が完了しました。出力ファイル: ${OUTPUT_PATH}`);
    } catch (error) {
        console.error('処理中にエラーが発生しました:', error);
        process.exit(1);
    }
}

updateAndPublished();
