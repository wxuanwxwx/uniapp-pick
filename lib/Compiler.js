const path = require('path');
const fs = require('fs');
// 抽象语法树
const parser = require('@babel/parser');
// 遍历更新@babel/parser生成的AST
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
// 模板引擎
const ejs = require('ejs');
// 发布订阅者模式
const {SyncHook} = require('tapable');
class Compiler {
  constructor(config) {
    this.config = config;
    this.entry = config.entry;
    this.root = process.cwd();
    this.modules = {};
    this.rules = config.module.rules;
    this.hooks = {
      beforeCompile: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      emit: new SyncHook(),
      afterEmit: new SyncHook(),
      done: new SyncHook(['stats'])
    }
    if(Array.isArray(config.plugins)) {
      config.plugins.forEach(item => item.apply(this));
    }
  }
  getSource(path) {
    return fs.readFileSync(path, 'utf-8');
  }
  depAnalyse(modulePath) {
    let dependencies = [];
    let source = this.getSource(modulePath);
    const rules = this.rules || [];
    const readAndCallLoader = (url, obj) => {
      const loader = require(path.join(this.root, url));
      source = loader.call(obj, source);
    }
    for(let i = rules.length - 1; i >= 0; i--) {
      const {use, test} = rules[i];
      if(test.test(modulePath)) {
        if (Object.prototype.toString.call(use) === '[object String]') {
          readAndCallLoader(use);
        } else if (Object.prototype.toString.call(use) === '[object Array]') {
          for(let j = use.length - 1; j >= 0; j--) readAndCallLoader(use[j]);
        } else if (Object.prototype.toString.call(use) === '[object Object]') {
          readAndCallLoader(use.loader, {query: use.options});
        }
      }
    }
    const ast = parser.parse(source);
    traverse(ast, {
      enter(p) {
        if(p.node.callee && p.node.callee.name === 'require') {
          let oldValue = `./${path.join('src', p.node.arguments[0].value)}`;
          oldValue = oldValue.replace(/\\+/g, '/');
          p.node.callee.name = '__webpack_require__';
          p.node.arguments[0].value = oldValue;
          dependencies.push(oldValue);
        }
      },
    });
    const sourceCode = generator(ast).code;
    // 获取相对路径
    let modulePathRelative = `./${path.relative(this.root, modulePath)}`;
    modulePathRelative = modulePathRelative.replace(/\\+/g, '/');
    this.modules[modulePathRelative] = sourceCode;
    dependencies.forEach(dep =>  this.depAnalyse(path.resolve(this.root, dep)));
  }
  emitFile() {
    const outputPath = path.join(this.config.output.path, this.config.output.filename);
    const template = this.getSource(path.join(__dirname, '../template/output.ejs'));
    const templateStr = ejs.render(template, {
      entry: this.entry,
      modules: this.modules
    });
    fs.mkdirSync(this.config.output.path, {recursive: true});
    fs.writeFileSync(outputPath, templateStr);
    return templateStr;
  }
  start() {
    this.hooks.beforeCompile.call();
    this.hooks.compile.call();
    // 获取绝对路径
    this.depAnalyse(path.resolve(this.root, this.entry));
    this.hooks.afterCompile.call();
    this.hooks.emit.call();
    this.hooks.afterEmit.call();
    const templateStr = this.emitFile();
    this.hooks.done.call({
      compilation: {
        assets: {
          [this.config.output.filename]: templateStr
        },
        outputOptions: {
          path: this.config.output.path
        }
      }
    });
  }
}
module.exports = Compiler;