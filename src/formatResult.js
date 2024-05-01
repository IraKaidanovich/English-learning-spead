module.exports = function(result) {
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

  return content;
}