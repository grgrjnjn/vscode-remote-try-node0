const fs = require('fs').promises;
const path = require('path');

async function processData() {
    try {
        // 最新のboard_data_*.jsonファイルを取得
        const contentDir = path.join(__dirname, '..', 'data', 'contents');
        const files = await fs.readdir(contentDir);
        const boardDataFiles = files.filter(file => file.startsWith('board_data_') && file.endsWith('.json'));
        const latestFile = boardDataFiles.sort().pop();

        if (!latestFile) {
            throw new Error('board_data_*.json ファイルが見つかりません。');
        }

        // 最新のJSONファイルを読み込む
        const jsonData = JSON.parse(await fs.readFile(path.join(contentDir, latestFile), 'utf8'));

        // ブラックリストを読み込む
        const blacklistPath = path.join(__dirname, '..', 'data', 'blacklist.list');
        const blacklist = (await fs.readFile(blacklistPath, 'utf8')).split('\n').filter(email => email.trim());

        // 現在の時刻を取得
        const now = new Date();

        // ブラックリストに含まれないデータをフィルタリングし、24時間以内の投稿のみを残す
        const filteredData = jsonData.filter(item => {
            const postTime = new Date(item.postTime.replace(/\(.\)/, ''));
            const timeDiff = now - postTime;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            return !blacklist.includes(item.email) && hoursDiff <= 24;
        });

        // postTimeの降順でソート
        filteredData.sort((a, b) => new Date(b.postTime.replace(/\(.\)/, '')) - new Date(a.postTime.replace(/\(.\)/, '')));

        // 結果をpublic/board_data.jsonに保存
        const outputPath = path.join(__dirname, '..', 'public', 'board_data.json');
        await fs.writeFile(outputPath, JSON.stringify(filteredData, null, 2));

        console.log(`処理が完了しました。出力ファイル: ${outputPath}`);
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

processData();