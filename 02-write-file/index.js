const { stdin, stdout } = require('process');
const path = require('node:path');
const fs = require('fs');
const writeStream = fs.createWriteStream(path.join(__dirname, 'destination.txt'));
stdout.write('Hello, you can write whatever you want. To cancel press the `ctrl + c` key combination or enter `exit`\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  writeStream.write(data)
});
process.on('exit', () => stdout.write('Goodbye'));
