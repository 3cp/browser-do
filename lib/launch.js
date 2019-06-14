const {spawn} = require('child_process');

module.exports = function(url, browser) {
  const args = browser.args || [];
  args.push(url);

  const proc = spawn(browser.path, args, {
    env: {
      ...process.env,
      'ELECTRON_DISABLE_SECURITY_WARNINGS': 'true'
    }
  });

  const oldKill = proc.kill;
  proc.kill = function() {
    if (browser.onExit) {
      browser.onExit(proc.pid);
    }
    oldKill.call(proc);
  };

  return proc;
};
