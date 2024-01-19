const fs = require('fs');
const path = require('path');

function copyDir(file) {
  fs.copyFile(
    path.join(__dirname, 'files', `${file}`),
    path.join(__dirname, 'files-copy', `${file}`),
    (err) => {
      if (err) {
        console.log('Error Found:', err);
      } else {
        return;
      }
    },
  );
}

// fs.rm(path.join(__dirname, 'files-copy'), { force: true, recursive: true });
fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Directory created successfully!');
});

fs.readdir(path.join(__dirname, 'files'), (err, files) => {
  if (err) {
    console.log('error');
  } else {
    files.forEach((file) => {
      copyDir(file);
    });
    console.log('\nContents of the files folder was copied');
  }
});
