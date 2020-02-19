const chrome = require('./chrome');
const headlessArgs = require('./_chromium-args').headlessArgs;

module.exports = function() {
  const info = chrome();

  return {
    ...info,
    args: [
      ...info.args,
      ...headlessArgs
    ]
  };
};
