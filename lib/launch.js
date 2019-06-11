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
  const {env} = process;

  let proc;
  if (process.platform === 'darwin' && name === 'safari') {
    proc = spawn('open', [
      '--wait-apps',
      '--new',
      '--fresh',
      '-a',
      browser.path,
      url,
      '--args',
      ...args
    ], {env});
  } else {
    args.push(url);
    proc = spawn(browser.path, args, {env});

    console.log('path', browser.path);
    console.log('args', args);
    console.log('pid', proc.pid);
  }

  proc.on('exit', () => {
    console.log('process onexit');
    if (browser.onExit) {
      browser.onExit(proc.pid);
    }
  });

  return proc;
};
