
const kebabCase = require('lodash.kebabcase');

function load(name) {
  return require('./browsers/' + name);
}

module.exports = function(browsername, _load = load) {
  const name = kebabCase(browsername);

  let browser;
  try {
    browser = _load(name);
  } catch (e) {
    return;
  }

  const bpath = browser.path[process.platform];
  if (!bpath) return;

  return {...browser, path: bpath};
};
