import { Items } from 'wow-classic-items';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const items = new Items();
const iconsDir = path.join(__dirname, '../icons');

// Create the directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Extract all unique icon URLs
const iconUrls = new Set();
for (const item of items) {
    if (item.icon) {
        // Ensure the URL uses https instead of http
        const secureUrl = item.icon.replace(/^http:\/\//i, 'https://');
        iconUrls.add(secureUrl);
    }
}

console.log(`Found ${iconUrls.size} unique icons. Starting download...`);

const downloadIcon = (originalUrl) => {
    return new Promise((resolve, reject) => {
        // Extract filename from the Blizzard URL and use Wowhead's server instead
        const fileName = originalUrl.split('/').pop();
        const dest = path.join(iconsDir, fileName);
        const wowheadUrl = `https://wow.zamimg.com/images/wow/icons/large/${fileName}`;
        
        // Skip if already downloaded and not empty
        if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
            resolve();
            return;
        }

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            rejectUnauthorized: false
        };

        const request = https.get(wowheadUrl, options, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                downloadIcon(response.headers.location).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode === 200) {
                const file = fs.createWriteStream(dest);
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else {
                console.log(`Failed to download ${fileName}: HTTP ${response.statusCode}`);
                if (fs.existsSync(dest)) {
                    fs.unlinkSync(dest); 
                }
                resolve(); // Resolve to avoid breaking the batch loop
            }
        });

        request.on('error', (err) => {
            console.log(`Error downloading ${fileName}: ${err.message}`);
            if (fs.existsSync(dest)) {
                fs.unlinkSync(dest);
            }
            resolve(); 
        });
    });
};

// Download in batches to avoid overwhelming the server
const downloadAll = async () => {
    const urlsArray = Array.from(iconUrls);
    const batchSize = 50; // Adjust batch size if necessary
    
    for (let i = 0; i < urlsArray.length; i += batchSize) {
        const batch = urlsArray.slice(i, i + batchSize);
        await Promise.all(batch.map(url => downloadIcon(url)));
        console.log(`Downloaded ${Math.min(i + batchSize, urlsArray.length)} / ${urlsArray.length}`);
    }
    console.log('Finished downloading all icons!');
};

downloadAll().catch(console.error);