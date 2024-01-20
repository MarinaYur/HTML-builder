const fs = require('fs');
const path = require('path');
const pathToStylesFolder = path.join(__dirname, 'styles');

async function createBundle() {
  try {
    const output = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'bundle.css'),
    );
    await fs.readdir(pathToStylesFolder, (err, files) => {
      if (err) console.error(err);
      files.forEach((file) => {
        const fileExt = path.extname(file);
        if (fileExt === '.css') {
          const input = fs.createReadStream(
            path.join(pathToStylesFolder, file),
            'utf8',
          );
          input.on('data', (data) => {
            output.write(data + '\n');
          });
        }
      });
    });
  } catch (error) {
    console.error(`Got an error trying to delete the file: ${error.message}`);
  }
}
createBundle();
