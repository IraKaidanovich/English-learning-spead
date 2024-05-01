module.exports = function saveResult(content) {
  try {
    fs.writeFileSync(`./result.txt`, content);
    // file written successfully
  } catch (err) {
    console.error(err);
  }
}
