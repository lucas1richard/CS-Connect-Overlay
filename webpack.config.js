module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/extension',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'angular']
        }
      }
    ]
  }
};
