'use strict';
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const dir = require('./src/config').dir;

const TARGET = process.env.npm_lifecycle_event;

let Config = {
  entry: [
    'babel-polyfill',
    path.join(dir.src, 'client.jsx')
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
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]
};

if (TARGET === 'build:prod') {
  Config = merge(Config, {
    bail: true,
    devtool: 'source-map',
    output: { publicPath: '/build/' },
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        dropDebugger: true,
        dropConsole: true,
        compressor: {
          warnings: false,
        },
      }),
    ],
  });
}

if (TARGET === 'server:dev') {
  Config = merge(Config, {
    devtool: 'eval',
    entry: ['webpack-hot-middleware/client'],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],
  });
}

module.exports = Config;
