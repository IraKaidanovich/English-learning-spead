const categorizeWords = require('./categorizeWords');
const saveWords = require('./saveWords');
const mapWords = require('./mapWords');
const filterDistinctWords = require('./filterDistinctWords');
const splitWordsByBooks = require('./splitWordsByBooks');
const calculateUnderstanding = require('./calculateUnderstanding');

module.exports = function (allWords) {
  const books = splitWordsByBooks(allWords);

  const mapOfAllWords = mapWords(allWords);
  const allDistinctWordsList = filterDistinctWords(mapOfAllWords);
  const totalProperWordsCount = allDistinctWordsList.reduce(([wordA, countA], [wordB, countB]) => ['', countA + countB], ['', 0])[1];

  const result = {
    'all words': [],
    'will understand': [],
    'will understand per book': [],
  }

  let lastBookLearnedWords = [];
  let lastBookRecognizableWords = [];
  for(let bookIndex = 0; bookIndex < books.length; bookIndex++) {
    const seenWords = books.slice(0, bookIndex + 1).flat();
    const map = mapWords(seenWords);
    const distinctWords = filterDistinctWords(map);
    const wordsCategories = categorizeWords(distinctWords);

    const bookWords = books[bookIndex];
    const bookWordsMap = mapWords(bookWords);
    const bookDistinctWordsList = filterDistinctWords(bookWordsMap);
    const bookProperWordsCount = bookDistinctWordsList.reduce(([wordA, countA], [wordB, countB]) => ['', countA + countB], ['', 0])[1];

    result['all words'].push(distinctWords.length); 

    const [understandingRate, understandingRatePerBook] = calculateUnderstanding({
      learnedWords: lastBookLearnedWords, 
      recognizableWords: lastBookRecognizableWords, 
      mapOfAllWords, 
      bookWordsMap,
      totalProperWordsCount,
      bookProperWordsCount
    });

    wordsCategories.forEach(([categoryName, categoryDistinctList, categoryTotalCount]) => {
      if(!result[categoryName]) result[categoryName] = [];

      result[categoryName].push(categoryDistinctList.length);

      if(bookIndex + 1 === books.length) saveWords(categoryName, categoryDistinctList);

      if(categoryName === 'will learn') lastBookLearnedWords = categoryDistinctList;
      if(categoryName === 'will recognize') lastBookRecognizableWords = categoryDistinctList;
    });

    result['will understand'].push(understandingRate);
    result['will understand per book'].push(understandingRatePerBook);

    console.log(`Book #${bookIndex + 1} out of ${books.length} finished`);
  }

  return result;
}