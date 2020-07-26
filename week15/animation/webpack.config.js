// const path = require('path');

module.exports = {
  entry: './main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  // mode: 'development',
  // optimization: {
  //   minimize: false,
  // }
}