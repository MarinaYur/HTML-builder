const fs = require('fs');
const path = require('path');

function printContentOfFolder(file) {
  fs.stat(path.join(__dirname, 'secret-folder', `${file}`), (err, stats) => {
    if (err) {
      console.log(err);
      return;
    }
    if (stats.isFile()) {
      const fileName = path.parse(file).name;
      const ext = path.extname(file).slice(1);
      const size = (stats.size / 1024).toFixed(3) + 'kb';
      let result = fileName + ' - ' + ext + ' - ' + size;
      console.log(result);
    }
  });
}

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  if (err) console.log(err);
  else {
    console.log('\nCurrent directory filenames:');
    files.forEach((file) => {
      printContentOfFolder(file);
    });
  }
});
