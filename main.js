const getBooksFileNames = require('./src/getBooksFileNames');
const getWords = require('./src/getWords');
const saveResult = require('./src/saveResult');
const formatResult = require('./src/formatResult');
const getResult = require('./src/getResult');

async function main() {
  const bookFileNames = getBooksFileNames();

  const words = await getWords(bookFileNames);

  const result = getResult(words);

  const content = formatResult(result);

  saveResult(content);
}

main();