const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  styles: path.join(__dirname, 'app', 'styles')
};

module.exports = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].bundle.js'
  },
  devtool:"source-map",
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders:["style", "css?sourceMap", "sass?sourceMap"]
      }
    ]
  },
  sassLoader: {
    includePaths: PATHS.styles
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'Redux Demo'
    })
  ]
};
