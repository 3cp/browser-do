const fs = require('fs');

function load(name) {
  return require('./browsers/' + name);
}

function fileExists(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isFile();
  } catch (e) {
    return false;
  }
};

module.exports = function(browsername, {
  // for tests
  _load = load,
  _fileExists = fileExists
} = {}) {
  let browser;
  try {
    browser = _load(browsername);
  } catch (e) {
    return;
  }

  if (typeof browser === 'function') {
    browser = browser();
  }

  if (!browser) return;

  const bpath = browser.path[process.platform];
  if (bpath && (bpath === 'open' || _fileExists(bpath))) {
    return {...browser, path: bpath};
  }
};
