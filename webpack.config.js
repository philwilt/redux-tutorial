const path = require('path');

module.exports = {
  entry: "./entry.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
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
    includePaths: [path.resolve(__dirname, "./styles")]
  }
};
