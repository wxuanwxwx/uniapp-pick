const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
module.exports = class HtlePlugin {
  constructor(options) {
    this.filename = options.filename;
    this.templateUrl = options.template || '/template/index.html';
  }
  apply(compiler) {
    compiler.hooks.done.tap('HtmlPlugin', stats => {
      const htmlTemplate = fs.readFileSync(path.join(process.cwd(), this.templateUrl), 'utf-8');
      const $ = cheerio.load(htmlTemplate);
      Object.keys(stats.compilation.assets).forEach(item => $(`<script src='${item}'></script>`).appendTo('body'));
      fs.writeFileSync(path.join(stats.compilation.outputOptions.path, this.filename), $.html());
    })
  }
}