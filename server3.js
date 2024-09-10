const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.get('/', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'public', 'board_data.json');
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>掲示板</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                margin: 0;
                padding: 20px;
            }
            .board {
                max-width: 800px;
                margin: 0 auto;
            }
            .post {
                background-color: white;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 15px;
                margin-bottom: 20px;
            }
            .post-header {
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
                margin-bottom: 10px;
            }
            .post-name {
                font-weight: bold;
                color: #007bff;
            }
            .post-email {
                color: #6c757d;
                font-size: 0.9em;
            }
            .post-info {
                font-size: 0.9em;
                color: #6c757d;
            }
            .post-message {
                white-space: pre-wrap;
                margin-bottom: 10px;
            }
            .post-images {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .post-images img {
                max-width: 200px;
                max-height: 200px;
                object-fit: cover;
            }
            .post-time {
                font-size: 0.8em;
                color: #6c757d;
                text-align: right;
            }
            .post-count {
                font-size: 0.8em;
                color: #28a745;
                margin-left: 10px;
            }
        </style>
    </head>
    <body>
        <div class="board">
            <h1>掲示板</h1>
            ${jsonData.map(post => `
                <div class="post">
                    <div class="post-header">
                        <span class="post-name">${post.name}</span>
                        <span class="post-email">&lt;${post.email}&gt;</span>
                        <span class="post-count">同一投稿数: ${post.同一投稿数}</span>
                    </div>
                    <div class="post-info">
                        住所: ${post.住所} | 年齢: ${post.年齢} | スタイル: ${post.ｽﾀｲﾙ} | 体型: ${post.体型}
                    </div>
                    <div class="post-message">${post.message}</div>
                    <div class="post-images">
                        ${post.images.map(img => `<img src="${img}" alt="投稿画像">`).join('')}
                    </div>
                    <div class="post-time">${post.postTime}</div>
                </div>
            `).join('')}
        </div>
    </body>
    </html>
    `;

    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Error reading board data');
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);