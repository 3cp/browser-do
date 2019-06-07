const {spawn} = require('child_process');
const getBrowser = require('./get-browser');

module.exports = function(name = 'electron') {
  const browser = getBrowser(name);
  if (!browser) {
    throw new Error('No browser found for ' + name);
  }

  return spawn(browser.path, browser.args, {env: process.env});
};
