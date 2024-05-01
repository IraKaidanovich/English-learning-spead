const fs = require('node:fs');
const getBooksFileNames = require('./src/getBooksFileNames');
const getWords = require('./src/getWords');
const mapWords = require('./src/mapWords');
const filterDistinctWords = require('./src/filterDistinctWords');
const categorizeWords = require('./src/categorizeWords');
const saveWords = require('./src/saveWords');
const saveResult = require('./src/saveResult');

async function main() {
  const bookFileNames = getBooksFileNames();

  let allWords = [];
  for(let fileName of bookFileNames) {
    const bookWords = await getWords(fileName);

    allWords = [...allWords, ...bookWords];
  }
  const mapOfAllWords = mapWords(allWords);
  const allDistinctWordsList = filterDistinctWords(mapOfAllWords);
  const totalProperWordsCount = allDistinctWordsList.reduce(([wordA, countA], [wordB, countB]) => ['', countA + countB], ['', 0])[1];

  const wordsGroups = [];
  const BOOK_LENGTH = 100 * 1000;
  for(let i = 0; i < allWords.length / BOOK_LENGTH; i++) {
    wordsGroups.push(allWords.slice(i * BOOK_LENGTH, (i + 1) * BOOK_LENGTH));
  }

  const result = {
    'all words': [],
    'will understand': [],
    'will understand per book': [],
  }
  for(let i = 0; i < wordsGroups.length; i++) {
    const words = wordsGroups.slice(0, i + 1).flat(); // each time the amount of words is bigger and bigger
    const map = mapWords(words);
    const distinctWords = filterDistinctWords(map);
    const wordsCategories = categorizeWords(distinctWords);

    const bookWords = wordsGroups[i];
    const bookWordsMap = mapWords(bookWords);
    const bookDistinctWordsList = filterDistinctWords(bookWordsMap);
    const bookProperWordsCount = bookDistinctWordsList.reduce(([wordA, countA], [wordB, countB]) => ['', countA + countB], ['', 0])[1];

    result['all words'].push(distinctWords.length); 
  
    let willLearnWords;
    let willRecognizeWords;
    wordsCategories.forEach(([categoryName, categoryDistinctList, categoryTotalCount]) => {
      if(!result[categoryName]) result[categoryName] = [];

      result[categoryName].push(categoryDistinctList.length);

      if(i + 1 === wordsGroups.length) saveWords(categoryName, categoryDistinctList);

      if(categoryName === 'will learn') willLearnWords = categoryDistinctList;
      if(categoryName === 'will recognize') willRecognizeWords = categoryDistinctList;
    });

    // calculate understanding against vocabulary of all the books combined and this book
    let totalUnderstandableCount = 0;
    let bookUnderstandableCount = 0;

    for(let i = 0; i < willLearnWords.length; i++) {
      const word = willLearnWords[i][0];
      const totalWordCount = mapOfAllWords[word];
      const bookWordCount = bookWordsMap[word] > 3 ? bookWordsMap[word] : 0;
      totalUnderstandableCount += totalWordCount;
      bookUnderstandableCount += bookWordCount;
    }

    for(let i = 0; i < willRecognizeWords.length; i++) {
      const word = willRecognizeWords[i][0];
      const totalWordCount = mapOfAllWords[word];
      const bookWordCount = bookWordsMap[word] > 3 ? bookWordsMap[word] : 0;
      totalUnderstandableCount += totalWordCount;
      bookUnderstandableCount += bookWordCount;
    }

    result['will understand'].push(Math.round(totalUnderstandableCount / totalProperWordsCount * 10000) / 100);
    result['will understand per book'].push(Math.round(bookUnderstandableCount / bookProperWordsCount * 10000) / 100);

    console.log(`Group #${i + 1} out of ${wordsGroups.length} finished`);
  }

  let content = '';
  let headerIsInPlace = false;
  for(let key in result) {
    let counts = result[key];

    if(!headerIsInPlace) {
      headerIsInPlace = true;

      content += `${''.padEnd(30, ' ')}: ${counts.map((_, index) => `Book #${index + 1}`.padEnd(10, ' ')).join(' | ')}\n`;
    }

    if(key === 'will understand' || key === 'will understand per book') counts = counts.map(count => count.toString() + '%');
    else counts = counts.map(count => (Math.round(count / 100) * 100));

    content += `${key.padEnd(30, ' ')}: ${counts.map(count => count.toString().padEnd(10, ' ')).join(' | ')}\n`;
  }

  saveResult(content);
}

function filterDistinctWords(map) {
  let distinctWords = [];
  for(let word in map) {
    const count = map[word];

    distinctWords.push([word, count]);
  }

  distinctWords.sort((a, b) => b[1] - a[1]);

  return distinctWords.filter(([word, count]) => count > 3);
}

function categorizeWords(distinctWords) {
  const conditions = [
    ['will learn', pair => pair[1] > 20],
    ['will recognize', pair => pair[1] >= 5 && pair[1] <= 20],
    ['will see a few times', pair => pair[1] < 5],
  ];

  let categories = [];

  conditions.forEach(([name, callback]) => {
    categories.push([name, distinctWords.filter(callback)]);
  });

  categories = categories.map(([name, distinctList]) => {
    const categoryTotalCount = distinctList.reduce(([wordA, countA], [wordB, countB]) => ['', countB + countA], ['', 0])[1];

    return [name, distinctList, categoryTotalCount];
  });

  return categories;
}

function saveWords(fileName, dictionary) {
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

function saveResult(content) {
  try {
    fs.writeFileSync(`./result.txt`, content);
    // file written successfully
  } catch (err) {
    console.error(err);
  }
}

main();