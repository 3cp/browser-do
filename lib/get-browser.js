function load(name) {
  return require('./browsers/' + name);
}

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
  if (bpath) {
    return {...browser, path: bpath};
  }
};
