const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
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
