const fs = require('node:fs');

module.exports = function mapWords(words) {
  const map = {};

  words.forEach(word => {
    map[word] = map[word] ? map[word] + 1 : 1;
  });

  return map;
}