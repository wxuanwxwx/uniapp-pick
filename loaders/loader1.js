module.exports = function(source) {
  const {query = {}} = this;
  console.log('我是loader1');
  return source.replace(/console.log\(/g, `console.log('${query.msg || 'loader1---'}', `);
}