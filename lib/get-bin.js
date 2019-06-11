const which = require('which');

module.exports = function(commands) {
  if (process.platform !== 'linux') {
    return null;
  }
  for (let i = 0; i < commands.length; i++) {
    try {
      if (which.sync(commands[i])) {
        return commands[i];
      }
    } catch (e) {
      // ignore
    }
  }
};
