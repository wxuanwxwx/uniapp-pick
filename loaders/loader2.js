module.exports = function(source) {
  console.log('我是loader2');
  return source.replace(/console.log\(/g, `console.log('loader2---', `);
}