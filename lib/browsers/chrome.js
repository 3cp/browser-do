const getBin = require('../get-bin');
const getDarwinBin = require('../get-darwin-bin');
const getExe = require('../get-exe');
const args = require('./_chromium-args').args;
const tmp = require('tmp');
tmp.setGracefulCleanup();

module.exports = function() {
  const tmpobj = tmp.dirSync({unsafeCleanup: true});

  return {
    path: {
      linux: getBin(['google-chrome', 'google-chrome-stable']),
      darwin: getDarwinBin('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
      win32: getExe('\\Google\\Chrome\\Application\\chrome.exe')
    },
    args: [
      '--user-data-dir=' + tmpobj.name,
      ...args
    ]
  };
};
