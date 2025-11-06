const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, 'src/contracts');
const targetDir = path.join(__dirname, 'build/src/contracts');

fs.copy(sourceDir, targetDir)
  .then(() => console.log('Contracts folder copied to build!'))
  .catch((err) => console.error('Error copying contracts:', err));
