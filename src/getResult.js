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
  for(let i = 0; i < books.length; i++) {
    const words = books.slice(0, i + 1).flat(); // each time the amount of words is bigger and bigger
    const map = mapWords(words);
    const distinctWords = filterDistinctWords(map);
    const wordsCategories = categorizeWords(distinctWords);

    const bookWords = books[i];
    const bookWordsMap = mapWords(bookWords);
    const bookDistinctWordsList = filterDistinctWords(bookWordsMap);
    const bookProperWordsCount = bookDistinctWordsList.reduce(([wordA, countA], [wordB, countB]) => ['', countA + countB], ['', 0])[1];

    result['all words'].push(distinctWords.length); 
  
    let willLearnWords;
    let willRecognizeWords;
    wordsCategories.forEach(([categoryName, categoryDistinctList, categoryTotalCount]) => {
      if(!result[categoryName]) result[categoryName] = [];

      result[categoryName].push(categoryDistinctList.length);

      if(i + 1 === books.length) saveWords(categoryName, categoryDistinctList);

      if(categoryName === 'will learn') willLearnWords = categoryDistinctList;
      if(categoryName === 'will recognize') willRecognizeWords = categoryDistinctList;
    });

    const [understandingRate, understandingRatePerBook] = calculateUnderstanding({
      learnedWords: willLearnWords, 
      recognizableWords: willRecognizeWords, 
      mapOfAllWords, 
      bookWordsMap,
      totalProperWordsCount,
      bookProperWordsCount
    });

    result['will understand'].push(understandingRate);
    result['will understand per book'].push(understandingRatePerBook);

    console.log(`Book #${i + 1} out of ${books.length} finished`);
  }

  return result;
}