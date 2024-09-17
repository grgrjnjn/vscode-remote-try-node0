const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const url = require('url');
const mime = require('mime-types');

function getLatestFile(dir, prefix) {
    const files = fs.readdirSync(dir).filter(file => file.startsWith(prefix));
    return files.sort().pop();
}

function downloadImage(imageUrl, outputPath) {
    const protocol = url.parse(imageUrl).protocol === 'https:' ? https : http;
    return new Promise((resolve, reject) => {
        protocol.get(imageUrl, (response) => {
            if (response.statusCode === 200) {
                const contentType = response.headers['content-type'];
                const extension = mime.extension(contentType) || 'jpg';
                const filePath = `${outputPath}.${extension}`;
                const fileStream = fs.createWriteStream(filePath);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve(filePath);
                });
            } else {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
}

function processImages(data, outputDir) {
    data.forEach(item => {
        if (item.images && Array.isArray(item.images)) {
            item.images = item.images.map(imageUrl => {
                if (imageUrl.startsWith('https://kanajo.com/public/thread/img/')) {
                    const parsedUrl = url.parse(imageUrl, true);
                    const id = parsedUrl.query.id;
                    if (id) {
                        const outputPath = path.join(outputDir, `kanajo_${id}`);
                        try {
                            const filePath = downloadImage(imageUrl, outputPath);
                            return path.relative(process.cwd(), filePath);
                        } catch (error) {
                            console.error(`Error downloading image: ${error.message}`);
                            return imageUrl;
                        }
                    }
                }
                return imageUrl;
            });
        }
    });
    return data;
}

function main() {
    const sourceDir = path.join(__dirname, '..', 'data', 'source', 'json');
    const latestFile = getLatestFile(sourceDir, 'kanajo_');
    const inputPath = path.join(sourceDir, latestFile);
    const outputDir = path.join(__dirname, '..', 'data', 'source', 'image');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const processedData = processImages(data, outputDir);

    fs.writeFileSync(inputPath, JSON.stringify(processedData, null, 2));
    console.log(`Processed and saved: ${inputPath}`);
}

main();