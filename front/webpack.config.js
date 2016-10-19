'use strict';
const webpack = require('webpack');
const path = require('path');
const config = require('./src/config');
const dir = config.dir;

let plugins = [];
let devServer = undefined;
let reactLoader = 'babel-loader';
let publicPath = '';

if (process.env.NODE_ENV === 'production') {
  plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ];
}
else {
  devServer = {
    host: 'localhost',
    port: config.get('HOT_RELOAD_SERVER_PORT'),
    inline: true
  };
  reactLoader = 'react-hot!babel-loader';
  publicPath = `http://localhost:${devServer.port}/build/`;
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
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        include: dir.src,
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: reactLoader,
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css?modules', 'sass' ]
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { // these are env variables that get forwarded to the client side (during the build!)
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'AUTH0_CLIENT_ID': JSON.stringify(process.env.AUTH0_CLIENT_ID),
        'AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN)
      }
    })
  ].concat(plugins),
  devServer
};

module.exports = Config;
