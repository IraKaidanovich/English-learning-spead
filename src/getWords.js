const fs = require('node:fs');

module.exports = async function getWords(fileName) {
  return new Promise((done) => {
    fs.readFile(`./books/${fileName}`, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      
      const words = data.toLowerCase().split(/\s+/).map(word => {
        word = word.replaceAll(/[^a-zа-я]/g, '');
    
        if(word.length <= 1) return '';
        else return word;
      }).filter(word => word.length);

      done(words);
    });
  });
}