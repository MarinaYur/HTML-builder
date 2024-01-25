const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToIndexHtml = path.join(pathToProjectDist, 'index.html');
const pathToStylesFolder = path.join(__dirname, 'styles');

async function buildSite() {
  try {
    changeTemplateContent();
    await fsp.mkdir(pathToProjectDist, { recursive: true });
    createStylesFile();
    await fsp.rm(path.join(pathToProjectDist, 'assets'), {
      force: true,
      recursive: true,
    });
    await fsp.mkdir(path.join(pathToProjectDist, 'assets'), {
      recursive: true,
    });
    const dirOfAssets = await fsp.readdir(path.join(__dirname, 'assets'));
    // copying assets
    for (let assetsDir of dirOfAssets) {
      fs.rm(
        path.join(__dirname, 'project-dist', assetsDir),
        { force: true, recursive: true },
        (error) => {
          fs.mkdir(
            path.join(__dirname, 'project-dist', 'assets', assetsDir),
            { recursive: true },
            (err) => {
              if (err) {
                return console.error(error);
              }
              fs.readdir(
                path.join(__dirname, 'assets', assetsDir),
                (err, files) => {
                  if (err) {
                    console.log('error');
                  } else {
                    files.forEach((file) => {
                      copyDir(assetsDir, file);
                    });
                    // console.log('\nContents of the files folder was copied');
                  }
                },
              );
              // console.log('\nDirectory created successfully!');
            },
          );
        },
      );
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function changeTemplateContent() {
  try {
    const templateContent = await fsp.readFile(pathToTemplate, 'utf8');
    let indexHtmlContent = templateContent;
    const componentsContent = await fsp.readdir(pathToComponents, 'utf8');

    componentsContent.forEach(async (htmlChunk) => {
      const htmlChunkName = path.parse(htmlChunk).name;
      const htmlChunkExt = path.extname(htmlChunk);
      const htmlChunkContent = await fsp.readFile(
        path.join(__dirname, `components/${htmlChunk}`),
        'utf8',
      );
      const regex = new RegExp(`{{${htmlChunkName}}}`, 'g');
      if (htmlChunkExt === '.html') {
        indexHtmlContent = indexHtmlContent.replace(
          regex,
          htmlChunkContent.trim(),
        );
      }
      await fsp.writeFile(pathToIndexHtml, indexHtmlContent);
    });
  } catch (err) {
    console.error(err.message);
  }
}

//copy styles from style folder to one styles.css
async function createStylesFile() {
  try {
    const output = fs.createWriteStream(
      path.join(pathToProjectDist, 'style.css'),
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

function copyDir(assetsDir, file) {
  fs.copyFile(
    path.join(__dirname, 'assets', assetsDir, file),
    path.join(__dirname, 'project-dist', 'assets', assetsDir, file),
    (err) => {
      if (err) {
        console.log('Error Found:', err);
      } else {
        return;
      }
    },
  );
}

buildSite();
