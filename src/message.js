const common = require('./common.js');

console.log('这是我的消息！message');
module.exports = {
  message: '这是我的名字！' + common.name
}