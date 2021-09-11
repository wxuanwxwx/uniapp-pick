const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // {
      //   test: /\.js/, 
      //   use: ['./loaders/loader1.js', './loaders/loader2.js', './loaders/loader3.js']
      // }
      // {
      //   test: /\.js/, 
      //   use: './loaders/loader1.js'
      // }
      {
        test: /\.js/, 
        use: { loader: './loaders/loader1.js', options: {msg: '---'} }
      }
    ]
  },
  mode: 'development'
}

// module.exports = {
//   mode: 'development',
//   plugins: [
//     new webpack.LoaderOptionsPlugin({
//       options: {
//         entry: './src/index.js',
//         output: {
//           path: path.join(__dirname, 'dist')
//         }
//       }
//     })
//   ]
// }
