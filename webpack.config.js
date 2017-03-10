const path = require('path'),
      UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
  entry: {
    'codice.fiscale': './lib/codice.fiscale.js'
  },
  output: {
    // this will publish the module on the window object in order to support the karma tests
    library: 'CodiceFiscale',
    libraryTarget: 'window',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new UglifyJSPlugin()
  ]
};
