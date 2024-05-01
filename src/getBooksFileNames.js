const fs = require('node:fs');

module.exports = function getBooksFileNames() {
  const fileNames = [];
  fs.readdirSync('./books').forEach(fileName => {
    fileNames.push(fileName);
  });  

  return fileNames;
}