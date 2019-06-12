const getBin = require('../get-bin');
const getDarwinBin = require('../get-darwin-bin');
const getExe = require('../get-exe');
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
      // https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md#--enable-automation
      '--enable-automation',
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-default-apps',
      '--disable-popup-blocking',
      '--disable-translate',
      '--disable-background-timer-throttling',
      // on macOS, disable-background-timer-throttling is not enough
      // and we need disable-renderer-backgrounding too
      // see https://github.com/karma-runner/karma-chrome-launcher/issues/123
      '--disable-renderer-backgrounding',
      '--disable-device-discovery-notifications'
    ],
    onExit() {
      tmpobj.removeCallback();
    }
  };
};
