const electron = require('electron');
const path = require('path');
const tmp = require('tmp');
tmp.setGracefulCleanup();

module.exports = function() {
  const tmpobj = tmp.dirSync({unsafeCleanup: true});

  return {
    path: {
      linux: electron,
      darwin: electron,
      win32: electron
    },
    args: [
      path.join(__dirname, 'electron-runner.js'),
      tmpobj.name
    ]
  };
};
