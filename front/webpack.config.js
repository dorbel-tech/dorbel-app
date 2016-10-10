'use strict';
const webpack = require('webpack');
const path = require('path');
const dir = require('./src/config').dir;

let Config = {
  entry: [
    'babel-polyfill',
    path.join(dir.src, 'components/Router.jsx')
  ],
  output: {
    path: path.join(dir.public, 'build'),
    filename: 'bundle.js',
  },
  resolve: {
    root: dir.src,
    extensions: ['', '.js', '.jsx', '.json'],
  },
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
      include: dir.src,
    }],
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }],
  }
};

if (process.env.NODE_ENV === 'production') {
  Config.plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ];
} else {
  // nothing for now
}

module.exports = Config;
