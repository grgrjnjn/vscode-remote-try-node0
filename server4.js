'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', (req, res) => {
    res.send('Hello remote world!\n');
});

// image.jpgを表示するルートを追加
app.get('/image', (req, res) => {
    const imagePath = path.join(__dirname, 'image2.jpg');
    
    // ファイルが存在するか確認
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send('Image not found');
        } else {
            res.sendFile(imagePath);
        }
    });
});

// HTMLページを表示するルートを追加
app.get('/view', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Image View</title>
        </head>
        <body>
            <h1>Local Image</h1>
            <img src="/image" alt="Local Image">
        </body>
        </html>
    `);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);