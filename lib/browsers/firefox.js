const getBin = require('../get-bin');
const getDarwinBin = require('../get-darwin-bin');
const getExe = require('../get-exe');
const path = require('path');
const fs = require('fs');
const tmp = require('tmp');
tmp.setGracefulCleanup();

const prefs = `
user_pref("browser.shell.checkDefaultBrowser", false);
user_pref("browser.bookmarks.restore_default_bookmarks", false);
user_pref("dom.disable_open_during_load", false);
user_pref("dom.max_script_run_time", 0);
user_pref("dom.min_background_timeout_value", 10);
user_pref("extensions.autoDisableScopes", 0);
user_pref("browser.tabs.remote.autostart", false);
user_pref("browser.tabs.remote.autostart.2", false);
user_pref("extensions.enabledScopes", 15);
`;

const paths = {
  linux: getBin(['firefox']),
  darwin: getDarwinBin('/Applications/Firefox.app/Contents/MacOS/firefox-bin'),
  win32: getExe('\\Mozilla Firefox\\firefox.exe')
};

module.exports = function() {
  const tmpobj = tmp.dirSync({unsafeCleanup: true});

  fs.writeFileSync(path.join(tmpobj.name, 'user.js'), prefs);

  return {
    path: paths,
    args: [
      '-profile',
      tmpobj.name,
      '-no-remote'
    ],
    onExit() {
      tmpobj.removeCallback();
    }
  };
};
