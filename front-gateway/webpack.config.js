'use strict';
const webpack = require('webpack');
const path = require('path');
const config = require('./src/config');
const dir = config.dir;

let plugins = [];
let preLoaders = [];
let devServer = undefined;
let reactLoader = 'babel-loader';
let publicPath = '';

if (process.env.NODE_ENV === 'development') {
  devServer = {
    host: 'localhost',
    port: config.get('HOT_RELOAD_SERVER_PORT'),
    inline: true
  };
  reactLoader = 'react-hot!babel-loader';
  publicPath = `http://localhost:${devServer.port}/build/`;
  preLoaders = [
    {
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
      include: dir.src,
    }
  ];
}
else {
  plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ];
}

let Config = {
  entry: [
    'babel-polyfill',
    path.join(dir.src, 'app.client.js')
  ],
  output: {
    path: path.join(dir.public, 'build'),
    filename: 'bundle.js',
    publicPath
  },
  resolve: {
    root: dir.src,
    extensions: ['', '.js', '.jsx', '.json'],
  },
  module: {
    // preLoaders,
    loaders: [
      {
        test: /\.jsx?$/,
        loader: reactLoader,
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css?modules', 'sass']
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ].concat(plugins),
  devServer
};

module.exports = Config;
