module.exports = function categorizeWords(distinctWords) {
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
