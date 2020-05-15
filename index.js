/* eslint-disable no-console */
const run = require('./lib/browser-run');
const through = require('through');
const {Writable} = require('stream');
const duplex = require('duplexer');
const tapParse = require('./lib/tap-parse');

module.exports = function(opts = {}) {
  const tap = opts.tap || opts.tape || opts.jasmine || opts.mocha;

  const chunks = [];
  const readInput = new Writable({
    write(chunk, enc, cb) {
      chunks.push(chunk);
      cb();
    }
  });

  const holdOutput = through();
  const dpl = duplex(readInput, holdOutput);

  dpl.failed = false;
  let browserDo;
  dpl.stop = () => {
    if (browserDo) browserDo.stop();
    dpl.emit('exit', 0);
  };

  readInput.on('finish', () => {
    const data = Buffer.concat(chunks).toString();
    browserDo = run(opts, data, holdOutput);

    if (tap) {
      tapParse(holdOutput, (err, passed) => {
        dpl.failed = !passed;

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
            dpl.stop();
            dpl.emit('exit', dpl.failed ? 1 : 0);
          }, 1000);
        }
      });
    }
  });

  return dpl;
};
