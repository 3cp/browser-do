const edge = require('./edge');

module.exports = function() {
  const info = edge();

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
