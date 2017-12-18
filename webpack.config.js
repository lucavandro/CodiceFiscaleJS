const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'codice.fiscale': './src/codice.fiscale.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack
      .optimize
      .UglifyJsPlugin()
  ]
};
