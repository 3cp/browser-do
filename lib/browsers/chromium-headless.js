const chromium = require('./chromium');

module.exports = function() {
  const info = chromium();

  return {
    ...info,
    args: [
      ...info.args,
      '--headless',
      '--disable-gpu',
      '--remote-debugging-port=9222'
    ]
  };
};