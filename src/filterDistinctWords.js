module.exports = function filterDistinctWords(map) {
  let distinctWords = [];
  for(let word in map) {
    const count = map[word];

    distinctWords.push([word, count]);
  }

  distinctWords.sort((a, b) => b[1] - a[1]);

  return distinctWords.filter(([word, count]) => count > 3);
}