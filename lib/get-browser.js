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

module.exports = function(browsername, _load = load) {
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
  if (bpath && fileExists(bpath)) {
    return {...browser, path: bpath};
  }
};
