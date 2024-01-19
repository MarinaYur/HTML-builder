const { stdout } = require('process');
const path = require('node:path');
const fs = require('fs');
const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
let data = '';
readableStream.on('data', (chunk) => (data += chunk));
readableStream.on('end', () => stdout.write(data));
