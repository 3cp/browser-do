const chromium = require('./chromium');
const headlessArgs = require('./_chromium-args').headlessArgs;

module.exports = function() {
  const info = chromium();

  return {
    ...info,
    args: [
      ...info.args,
      ...headlessArgs
    ]
  };
};