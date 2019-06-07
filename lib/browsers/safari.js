const getDarwinBin = require('../get-darwin-bin');

module.exports = {
  path: {
    darwin: getDarwinBin('/Applications/Safari.app/Contents/MacOS/Safari')
  }
};
