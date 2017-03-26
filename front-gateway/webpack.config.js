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
    port: process.env.HOT_RELOAD_SERVER_PORT || 8888,
    inline: true
  };
  reactLoader = ['react-hot-loader', 'babel-loader'];
  publicPath = `http://localhost:${devServer.port}/build/`;

  // remove hashes in dev
  jsBundleFileName = cssBundleFileName = 'bundle';
} else {
  plugins = [
    new WebpackMd5Hash(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      },
      sourceMap: true
    }),
    new ManifestPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
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
    // http://stackoverflow.com/questions/41981735/webpack-2-director-router-is-not-working-after-compilation-process
    mainFields: ['browserify', 'browser', 'module', 'main'],
    modules: [dir.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      { test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/, use: 'file-loader' },
      { test: /\.jsx?$/, use: reactLoader, exclude: /node_modules/, },
      { test: /\.(css|scss)$/, use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?sourceMap', 'sass-loader']
      })},
      { test: /\.png$/, use: 'url-loader?limit=100000' },
      { test: /\.jpg$/, use: 'file-loader' }
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
