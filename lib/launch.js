const {spawn} = require('child_process');
const kebabCase = require('lodash.kebabcase');
const getBrowser = require('./get-browser');

module.exports = function(url, browsername = 'electron') {
  const name = kebabCase(browsername);
  const browser = getBrowser(name);
  if (!browser) {
    throw new Error('No browser found for ' + name);
  }

  const args = browser.args || [];
  args.push(url);

  const proc = spawn(browser.path, args, {env: process.env});

  console.log('path', browser.path);
  console.log('args', args);
  console.log('pid', proc.pid);

  proc.on('exit', code => {
    console.log('process onexit');
    if (browser.onExit) {
      browser.onExit(proc.pid, code);
    }
  });

  return proc;
};
