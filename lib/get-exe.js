const path = require('path');
const fs = require('fs');
const prefixes = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']];

module.exports = function(suffix) {
  // Only run these checks on win32
  if (process.platform !== 'win32') {
    return null;
  }

  for (let i = 0; i < prefixes.length; i++) {
    try {
      const exePath = path.join(prefixes[i], suffix);
      fs.accessSync(exePath);
      return exePath;
    } catch (e) {
      // ignore
    }
  }
};
