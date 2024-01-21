const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToHeader = path.join(__dirname, 'components/header.html');
const pathToFooter = path.join(__dirname, 'components/footer.html');
const pathToArticles = path.join(__dirname, 'components/articles.html');
const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToIndexHtml = path.join(pathToProjectDist, 'index.html');
const pathToStylesFolder = path.join(__dirname, 'styles');
// const output = fs.createWriteStream(path.join(__dirname, 'template.html'));

async function buildSite() {
  try {
    let templateContent = await fsp.readFile(pathToTemplate, 'utf8');
    let headerContent = await fsp.readFile(pathToHeader, 'utf8');
    let footerContent = await fsp.readFile(pathToFooter, 'utf8');
    let articlesContent = await fsp.readFile(pathToArticles, 'utf8');

    let indexHtmlContent = templateContent
      .replace(/{{header}}/, headerContent.trim())
      .replace(/{{footer}}/, footerContent.trim())
      .replace(/{{articles}}/, articlesContent);

    await fsp.mkdir(pathToProjectDist, { recursive: true });
    await fsp.writeFile(pathToIndexHtml, indexHtmlContent);
    createStylesFile();
    copyDir();
  } catch (err) {
    console.error(err.message);
  }
}
async function createStylesFile() {
  try {
    const output = fs.createWriteStream(
      path.join(pathToProjectDist, 'styles.css'),
    );
    await fs.readdir(pathToStylesFolder, (err, files) => {
      if (err) console.error(err);
      files.forEach((file) => {
        // console.log(file);
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

function copyDir() {
  const option = {
    withFileTypes: true,
  };
  fs.rm(
    path.join(pathToProjectDist, 'assets'),
    { force: true, recursive: true },
    (error) => {
      fs.mkdir(
        path.join(pathToProjectDist, 'assets'),
        { recursive: true },
        (err) => {
          if (err) {
            return console.error(error);
          }
          fs.readdir(path.join(__dirname, 'assets'), option, (err, files) => {
            if (err) {
              console.log('error');
            } else {
              files.forEach((file) => {
                console.log(file);
                // !file.isFile() ?
                fs.copyFile(
                  path.join(__dirname, 'assets', file),
                  path.join(pathToProjectDist, 'assets', file),
                  (err) => {
                    if (err) {
                      console.log('Error Found:', err);
                    } else {
                      return;
                    }
                  },
                );
              });
              console.log('\nContents of the files folder was copied');
            }
          });
          console.log('\nDirectory created successfully!');
        },
      );
    },
  );
}

buildSite();
