const getDarwinBin = require('../get-darwin-bin');
const getExe = require('../get-exe');
const args = require('./_chromium-args').args;
const tmp = require('tmp');
tmp.setGracefulCleanup();

module.exports = function() {
  const tmpobj = tmp.dirSync({unsafeCleanup: true});

  return {
    path: {
      darwin: getDarwinBin('/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'),
      win32: getExe('Microsoft\\Edge\\Application\\msedge.exe')
    },
    args: [
      '--user-data-dir=' + tmpobj.name,
      ...args
    ],
    onExit() {
      tmpobj.removeCallback();
    }
  };
};
