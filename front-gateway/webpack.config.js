'use strict';
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const config = require('./src/config');
const dir = config.dir;

let plugins = [];
let devServer = undefined;
let reactLoader = 'babel-loader';
let publicPath = '';
let jsBundleFileName = 'bundle.[chunkhash]';
let cssBundleFileName = 'bundle.[contenthash]';

if (process.env.NODE_ENV === 'development') {
  devServer = {
    host: 'localhost',
    port: config.get('HOT_RELOAD_SERVER_PORT'),
    inline: true
  };
  reactLoader = 'react-hot!babel-loader';
  publicPath = `http://localhost:${devServer.port}/build/`;
  jsBundleFileName = cssBundleFileName = 'bundle'; // remove hashes in dev
} else {
  plugins = [
    new WebpackMd5Hash(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ManifestPlugin(),
  ];
}

let Config = {
  entry: [
    'babel-polyfill',
    path.join(dir.src, 'app.client.js')
  ],
  output: {
    path: path.join(dir.public, 'build'),
    filename: jsBundleFileName + '.js',
    publicPath
  },
  resolve: {
    root: dir.src,
    extensions: ['', '.js', '.jsx', '.json'],
  },
  module: {
    loaders: [
      { test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/, loader: 'file' },
      { test: /\.jsx?$/, loader: reactLoader, exclude: /node_modules/, },
      { test: /\.(css|scss)$/, loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass') },
      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // these two are replaced with 'hard coded' values because it affects the build result
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.IS_CLIENT': JSON.stringify(true),
      // the rest of the times the client will look for the env vars in window.dorbelConfig (defined in app.server.js)
      'process.env' : 'window.dorbelConfig'
    }),
    new ExtractTextPlugin(cssBundleFileName + '.css')
  ].concat(plugins),
  devServer
};

module.exports = Config;
