const path = require('path');

module.exports = {
  entry: {
    'codice.fiscale': './codice.fiscale.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
