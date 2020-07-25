const path = require('path');

module.exports = {
  entry: './main.js',
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
      },
      {
        test: /\.view/,
        use: {
          loader: require.resolve("./myloader.js")
        }
      }
    ]
  },
  mode: 'development',
  optimization: {
    minimize: false,
  }
};