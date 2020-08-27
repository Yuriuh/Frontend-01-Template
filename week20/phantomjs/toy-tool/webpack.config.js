const path = require('path');

// https://webpack.js.org/concepts/
module.exports = {
  entry: path.resolve(__dirname, './src/carousel.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          // https://github.com/babel/babel-loader
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                // https://babeljs.io/docs/en/babel-plugin-transform-react-jsx/
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'createElement', // 不配置此处的话，JSX会默认转换为React.createElement
                },
              ],
            ],
          },
        },
      },
      // {
      //   test: /\.css/,
      //   use: {
      //     loader: require.resolve('./cssloader.js'),
      //     // loader: 'css-loader',
      //     // loader: require.resolve('./carousel.css'),
      //   },
      // },
    ],
  },
  plugins: [
    new (require('html-webpack-plugin'))({
      title: 'htmlName',
      filename: 'index.html',
      template: './src/index.html',
      inject: true,
    }),
  ],
  // 代码配置为不压缩
  mode: 'development',
  optimization: {
    minimize: false,
  },
  devServer: {
    open: true,
    compress: false,
    contentBase: './src',
  },
};
