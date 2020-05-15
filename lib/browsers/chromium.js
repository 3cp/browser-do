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
      linux: getBin(['chromium-browser', 'chromium']),
      darwin: getDarwinBin('/Applications/Chromium.app/Contents/MacOS/Chromium'),
      win32: getExe('\\Chromium\\Application\\chrome.exe')
    },
    args: [
      '--user-data-dir=' + tmpobj.name,
      ...args
    ]
  };
};
