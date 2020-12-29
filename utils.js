var fs = require('fs'); 
fs.createReadStream('./dist/codice.fiscale.var.js')
.pipe(fs.createWriteStream('./dist/codice-fiscale-var.js'))