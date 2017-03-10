const path = require('path'),
      UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
  entry: {
    'codice.fiscale': './lib/codice.fiscale.js'
  },
  output: {
    library: 'CodiceFiscale',
    libraryTarget: 'window',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new UglifyJSPlugin()
  ]
};
