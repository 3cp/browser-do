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

  let failed = false;

  readInput.on('finish', () => {
    const data = Buffer.concat(chunks).toString();

    const browserDo = run(opts, data, holdOutput);

    if (tap) {
      tapParse(holdOutput, (err, passed) => {
        failed = !passed;

        if (err) {
          console.error(err.message);
        }

        if (!opts.keepOpen) {
          setTimeout(() => {
            process.exit(passed ? 0 : 1);
          }, 1000);
        }
      });
    }

    function stop() {
      browserDo.stop();
    }

    process.on('exit', stop);
    dpl.stop = stop;

    process.on('SIGINT', () => {
      // manually call process.exit() so it will trigger 'exit' event.
      process.exit(failed ? 1 : 0);
    });
  });

  return dpl;
};
