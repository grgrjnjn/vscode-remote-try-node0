
// processData関数をもっと明瞭にするために以下のように修正してください。
// ・最新のboard_data_*.jsonファイルの読み込み
// ・postTimeが24時間以内の記事だけ残すフィルタ関数にかける
// ・ブラックリストに該当する記事をフィルタする関数にかける
// ・public/board_data.jsonとして書き出す

// ・画像ファイルに関する処理を全て削除する

//published2.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '..', 'data', 'contents');
const BLACKLIST_PATH = path.join(__dirname, '..', 'data', 'blacklist.list');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'board_data.json');
const HOURS_LIMIT = 24;

async function getLatestBoardDataFile() {
    const files = await fs.readdir(CONTENT_DIR);
    const boardDataFiles = files.filter(file => file.startsWith('board_data_') && file.endsWith('.json'));
    const latestFile = boardDataFiles.sort().pop();
    if (!latestFile) {
        throw new Error('board_data_*.json ファイルが見つかりません。');
    }
    return latestFile;
}

async function readJsonFile(filePath) {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
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

async function processData() {
    // 最新のboard_data_*.jsonファイルの読み込み
    const latestFile = await getLatestBoardDataFile();
    const jsonData = await readJsonFile(path.join(CONTENT_DIR, latestFile));

    // postTimeが24時間以内の記事だけ残すフィルタ関数にかける
    let filteredData = filterRecentPosts(jsonData);

    // ブラックリストに該当する記事をフィルタする関数にかける
    const blacklist = await readBlacklist();
    filteredData = filterBlacklistedPosts(filteredData, blacklist);

    // public/board_data.jsonとして書き出す
    await fs.writeFile(OUTPUT_PATH, JSON.stringify(filteredData, null, 2));

    console.log(`処理が完了しました。出力ファイル: ${OUTPUT_PATH}`);

}

processData().catch(error => {
    console.error('処理中にエラーが発生しました:', error);
    process.exit(1);
});
