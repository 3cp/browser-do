const chrome = require('./chrome');

module.exports = function() {
  const info = chrome();

  return {
    ...info,
    args: [
      ...info.args,
      '--headless',
      '--disable-gpu'
    ]
  };
};
