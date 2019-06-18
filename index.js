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
  dpl.stop = () => browserDo && browserDo.stop();

  readInput.on('finish', () => {
    const data = Buffer.concat(chunks).toString();
    browserDo = run(opts, data, holdOutput);

    if (tap) {
      tapParse(holdOutput, (err, passed) => {
        dpl.failed = !passed;

        if (err) {
          console.error(err.message);
        }

        if (!opts.keepOpen) {
          setTimeout(() => {
            dpl.stop();
            dpl.emit('exit', dpl.failed ? 1 : 0);
          }, 1000);
        }
      });
    }
  });

  return dpl;
};
