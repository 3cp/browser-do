const getBin = require('../get-bin');
const getDarwinBin = require('../get-darwin-bin');
const getExe = require('../get-exe');
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
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-default-apps',
      '--disable-popup-blocking',
      '--disable-translate',
      '--disable-background-timer-throttling'
    ],
    onExit: () => tmpobj.removeCallback()
  };
};
