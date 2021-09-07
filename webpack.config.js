const path = require('path');

module.export = {
  enter: {
    index: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist')
  },
  mode: 'development'
}