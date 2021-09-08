const path = require('path');
const fs = require('fs');
// 抽象语法树
const parser = require('@babel/parser');
// 遍历更新@babel/parser生成的AST
const traverse = require('@babel/traverse').default;
class Compiler {
  constructor(config) {
    this.config = config;
    this.entry = config.entry;
    this.root = process.cwd();
  }
  getSource(path) {
    return fs.readFileSync(path, 'utf-8');
  }
  depAnalyse(modulePath) {
    const source = this.getSource(modulePath);
    const ast = parser.parse(source);
    traverse(ast, {
      enter(p) {
        if(p.node.callee && p.node.callee.name === 'require') {
          console.log('require引入')
        }
      },
    });
  }
  start() {
    this.depAnalyse(this.entry);
  }
}
module.exports = Compiler;