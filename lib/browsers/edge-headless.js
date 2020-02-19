const edge = require('./edge');
const headlessArgs = require('./_chromium-args').headlessArgs;

module.exports = function() {
  const info = edge();

  return {
    ...info,
    args: [
      ...info.args,
      ...headlessArgs
    ]
  };
};
