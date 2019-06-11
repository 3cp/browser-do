const firefox = require('./firefox');

module.exports = function() {
  const info = firefox();

  return {
    ...info,
    args: [
      ...info.args,
      '-headless'
    ]
  };
};
