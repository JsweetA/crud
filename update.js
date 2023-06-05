const fs = require('fs');
const path = require('path');
const process = require('process');

const copyDir = (sd, td) => {
  const sourceFile = fs.readdirSync(sd, { withFileTypes: true });
  for (const file of sourceFile) {
    const srcFile = path.resolve(sd, file.name);
    const tagFile = path.resolve(td, file.name);
    if (file.isDirectory() && !fs.existsSync(tagFile)) {
      fs.mkdirSync(tagFile, err => console.log(err));
      copyDir(srcFile, tagFile);
    } else if (file.isDirectory() && fs.existsSync(tagFile)) {
      copyDir(srcFile, tagFile);
    }
    !file.isDirectory() && fs.copyFileSync(srcFile, tagFile, fs.constants.COPYFILE_FICLONE);
  }
};

const removeDir = (dir) => {
  let files = fs.readdirSync(dir);
  for(let i = 0; i < files.length; i++){
    let newPath = path.join(dir, files[i]);
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      removeDir(newPath);
    } else {
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir);
};

const sourceDir = process.argv[2]
const targetDir = process.argv[3]

const run = async () => {
  if (!fs.existsSync(sourceDir)) return;
  if (fs.existsSync(targetDir)) removeDir(targetDir);
  await fs.mkdirSync(targetDir, err => console.log(err))
  await copyDir(sourceDir, targetDir)
}

run();