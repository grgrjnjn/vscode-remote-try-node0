// 画像の移動とJSONのimagesパスの変更
// 画像がないとエラーになるのを修正
// public/image/の不要な画像を削除
// 正しく動作しているのかは未確認、とりあえず動く



import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function moveImage(sourcePath, destPath) {
    try {
        if (fs.existsSync(sourcePath)) {
            fs.renameSync(sourcePath, destPath);
        } else {
            console.warn(`画像が見つかりません: ${sourcePath}`);
        }
    } catch (error) {
        console.error(`画像の移動に失敗しました: ${sourcePath} -> ${destPath}`, error);
    }
}

function processData() {
    try {
        // 最新のboard_data_*.jsonファイルを取得
        const contentDir = path.join(__dirname, '..', 'data', 'contents');
        const files = fs.readdirSync(contentDir);
        const boardDataFiles = files.filter(file => file.startsWith('board_data_') && file.endsWith('.json'));
        const latestFile = boardDataFiles.sort().pop();

        if (!latestFile) {
            throw new Error('board_data_*.json ファイルが見つかりません。');
        }

        // 最新のJSONファイルを読み込む
        const jsonData = JSON.parse(fs.readFileSync(path.join(contentDir, latestFile), 'utf8'));

        // ブラックリストを読み込む
        const blacklistPath = path.join(__dirname, '..', 'data', 'blacklist.list');
        const blacklist = fs.readFileSync(blacklistPath, 'utf8').split('\n').filter(email => email.trim());

        // 現在の時刻を取得
        const now = new Date();

        // ブラックリストに含まれないデータをフィルタリングし、24時間以内の投稿のみを残す
        const filteredData = jsonData.filter(item => {
            const postTime = new Date(item.postTime.replace(/\(.\)/, ''));
            const timeDiff = now - postTime;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            return !blacklist.includes(item.email) && hoursDiff <= 24;
        });

        // 画像ファイルの移動と JSON の更新
        filteredData.forEach(item => {
            if (item.images && Array.isArray(item.images)) {
                item.images = item.images.map(imagePath => {
                    if (imagePath.startsWith('data/source/image/')) {
                        const fileName = path.basename(imagePath);
                        const sourcePath = path.join(__dirname, '..', imagePath);
                        const destPath = path.join(__dirname, '..', 'public', 'image', fileName);
                        moveImage(sourcePath, destPath);
                        return `image/${fileName}`;
                    }
                    return imagePath;
                });
            }
        });

        // postTimeの降順でソート
        filteredData.sort((a, b) => new Date(b.postTime.replace(/\(.\)/, '')) - new Date(a.postTime.replace(/\(.\)/, '')));

        // 結果をpublic/board_data.jsonに保存
        const outputPath = path.join(__dirname, '..', 'public', 'board_data.json');
        fs.writeFileSync(outputPath, JSON.stringify(filteredData, null, 2));

        console.log(`処理が完了しました。出力ファイル: ${outputPath}`);

        // JSONのimagesの値と実際のファイルを比較し、不要なファイルを削除する処理
        const imageDir = path.join(__dirname, '..', 'public', 'image');
        const existingFiles = fs.readdirSync(imageDir);
        const usedImages = new Set();

        filteredData.forEach(item => {
            if (item.images && Array.isArray(item.images)) {
                item.images.forEach(imagePath => {
                    if (imagePath.startsWith('image/')) {
                        usedImages.add(imagePath.replace('image/', ''));
                    }
                });
            }
        });

        existingFiles.forEach(file => {
            if (!usedImages.has(file)) {
                const filePath = path.join(imageDir, file);
                fs.unlinkSync(filePath);
                console.log(`不要なファイルを削除しました: ${filePath}`);
            }
        });

    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

processData();
