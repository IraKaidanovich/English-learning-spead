module.exports = function(words) {
  const wordsGroups = [];
  const BOOK_LENGTH = 100 * 1000;
  for(let i = 0; i < words.length / BOOK_LENGTH; i++) {
    wordsGroups.push(words.slice(i * BOOK_LENGTH, (i + 1) * BOOK_LENGTH));
  }

  return wordsGroups;
}