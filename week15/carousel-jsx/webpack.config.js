const path = require('path');

module.exports = {
  entry: './main.js',
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: 'my-first-webpack.bundle.js'
  // },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'createElement'
                }
              ]
            ]
          }
        }
      }
    ]
  },
  mode: 'development',
  optimization: {
    minimize: false,
  }
};