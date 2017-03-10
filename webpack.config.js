const path = require('path');

module.exports = {
  entry: {
    'codice.fiscale': './codice.fiscale.js'
  },
  output: {
    library: 'CodiceFiscale',
    libraryTarget: 'window',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
