/* eslint-disable no-console */
const run = require('./lib/browser-run');
const {Transform} = require('stream');
const tapParse = require('./lib/tap-parse');

module.exports = function(opts = {}) {
  const tap = opts.tap || opts.tape || opts.jasmine || opts.mocha;

  const chunks = [];
  const dpl = new Transform({
    transform(chunk, enc, cb) {
      chunks.push(chunk);
      cb();
    },
    flush(cb) {
      const self = this;
      let failed = false;
      let browserDo;
      self.stop = () => browserDo && browserDo.stop();
      const holdOutput = new Transform({
        transform(chunk, enc, _cb) {
          _cb(null, chunk);
          self.push(chunk);
        },
        flush(_cb) {
          if (!tap) cb();
          _cb();
        }
      });

      const data = Buffer.concat(chunks).toString();
      browserDo = run(opts, data, holdOutput);

      if (tap) {
        tapParse(holdOutput, (err, passed) => {
          failed = !passed;

          if (err) {
            console.error(err.message);
          }

          if (opts.onCoverage) {
            browserDo.askCoverage();
          }

          if (!opts.keepOpen) {
            setTimeout(() => {
              if (opts.onCoverage) {
                browserDo.checkCoverage(opts.onCoverage);
              }
              self.stop();
              cb();
              self.emit('exit', failed ? 1 : 0);
            }, 1000);
          }
        });
      }
    }
  });

  return dpl;
};
