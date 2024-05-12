const fs = require('fs');
const path = require('path');

module.exports = function(req, res){
  if (req.url === '/mock/_jasmine-good.js') {
    fs.createReadStream(
      path.join(__dirname, '..', 'test-samples-dist', '_jasmine-good.js')
    ).pipe(res);
  } else if (req.url === '/mock/_jasmine-bad.js') {
    fs.createReadStream(
      path.join(__dirname, '..', 'test-samples-dist', '_jasmine-bad.js')
    ).pipe(res);
  }
};
