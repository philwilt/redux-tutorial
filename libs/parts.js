const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

exports.indexTemplate = function(options) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        template: require('html-webpack-template'),
        title: options.title,
        appMountId: options.appMountId,
        inject: false
      })
    ]
  };
}

exports.loadJSX = function(include) {
  return {
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          // Enable caching for extra performance
          loaders: ['babel?cacheDirectory'],
          include: include,
        }
      ]
    }
  };
}

exports.loadIsparta = function(include) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          loaders: ['isparta-instrumenter'],
          include: include
        }
      ]
    }
  };
}

exports.lintJSX = function(include) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          loaders: ['eslint'],
          exclude: /node_modules/,
          include: include
        }
      ]
    }
  };
}

exports.enableReactPerformanceTools = function() {
  return {
    module: {
      loaders: [
        {
          test: require.resolve('react'),
          loader: 'expose?React'
        }
      ]
    }
  };
}

exports.devServer = function(options) {
  const ret = {
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      quiet: true,

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };

  if(options.poll) {
    ret.watchOptions = {
      aggregateTimeout: 300,
      poll: 1000
    };
  }

  return ret;
}

exports.setupCSS = function(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass'],
          include: paths
        }
      ]
    }
  };
}

exports.minify = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  };
}

exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
}

exports.extractBundle = function(options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define an entry point needed for splitting.
    entry: entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest'],

        // options.name modules only
        minChunks: Infinity
      })
    ]
  };
}

exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  };
}

exports.extractCSS = function(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css', 'sass'),
          include: paths
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  };
}

exports.npmInstall = function(options) {
  options = options || {};

  return {
    plugins: [
      new NpmInstallPlugin(options)
    ]
  };
}
