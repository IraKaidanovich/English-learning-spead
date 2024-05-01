module.exports = function ({
  learnedWords, 
  recognizableWords, 
  mapOfAllWords, 
  bookWordsMap, 
  totalProperWordsCount,
  bookProperWordsCount
}) {
  let totalUnderstandableCount = 0;
  let bookUnderstandableCount = 0;

  const understandableWords = [...learnedWords, ...recognizableWords];
  for(let i = 0; i < understandableWords.length; i++) {
    const word = understandableWords[i][0];
    const totalWordCount = mapOfAllWords[word];
    const bookWordCount = bookWordsMap[word] > 3 ? bookWordsMap[word] : 0;
    totalUnderstandableCount += totalWordCount;
    bookUnderstandableCount += bookWordCount;
  }

  const understandingRate = Math.round(totalUnderstandableCount / totalProperWordsCount * 10000) / 100;
  const understandingRatePerBook = Math.round(bookUnderstandableCount / bookProperWordsCount * 10000) / 100;
  return [understandingRate, understandingRatePerBook];
}