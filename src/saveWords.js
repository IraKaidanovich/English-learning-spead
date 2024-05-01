const fs = require('node:fs');

module.exports = function saveWords(fileName, dictionary) {
  let content = '';
  dictionary.forEach(pair => {
    content += `${pair[0]} *: ${pair[1]}\n`;
  });

  try {
    fs.writeFileSync(`./distinctWords/${fileName}.txt`, content);
    // file written successfully
  } catch (err) {
    console.error(err);
  }
}