const path = require('path');
const fs = require('fs');

module.exports = function(defaultPath) {
  if (process.platform !== 'darwin') {
    return null;
  }

  try {
    var homePath = path.join(process.env.HOME, defaultPath);
    fs.accessSync(homePath);
    return homePath;
  } catch (e) {
    try {
      fs.accessSync(defaultPath);
      return defaultPath;
    } catch (e) {
      return null;
    }
  }
};
