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
      },
      // {
      //   test: /\.css$/,
      //   use: {
      //     loader: 'css-loader',
      //   }
      // },
      {
        test: /\.css$/,
        use: {
          loader: require.resolve('./utils/component-css-loader.js'),
        }
      }
    ]
  },
  mode: 'development',
  optimization: {
    minimize: false,
  }
};