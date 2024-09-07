'use strict';

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', async (req, res) => {
  try {
    // board_data.jsonファイルの絶対パスを取得
    const filePath = path.join(__dirname, 'board_data.json');
    
    // ファイルの内容を非同期で読み込む
    const data = await fs.readFile(filePath, 'utf8');
    
    // JSONをパースする
    const jsonData = JSON.parse(data);
    
    // JSONデータをHTMLにフォーマットする
    const htmlContent = `
      <html>
        <head>
          <title>Board Data</title>
          <style>
            body { font-family: Arial, sans-serif; }
            pre { background-color: #f0f0f0; padding: 10px; }
          </style>
        </head>
        <body>
          <h1>Board Data</h1>
          <pre>${JSON.stringify(jsonData, null, 2)}</pre>
        </body>
      </html>
    `;
    
    // HTMLコンテンツを送信
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Error reading board data');
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);