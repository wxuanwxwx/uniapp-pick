module.exports = function(source) {
  console.log('我是loader3');
  return source.replace(/console.log\(/g, `console.log('loader3---', `);
}