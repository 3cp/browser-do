#!/usr/bin/env node

const run = require('../index');
const opts = require('commander');
const through = require('through');
const {Writable} = require('stream');
const tapFinished = require('../lib/tap-finished');

opts
  .version(require('../package.json').version)
  .option('-b, --browser <name>', 'Browser to use, see available browsers below', 'electron')
  .option('-p, --port', 'Starts listening on that port and waits for you to open a browser')
  .option('-s, --static', 'Serve static assets from this directory')
  .option('-m, --mock', 'Path to code to handle requests for mocking a dynamic back-end')
  .option('-t, --tap', 'Treat output as TAP test result, automatically exit when TAP finishes')
  .option('-j, --jasmine', 'Support jasmine test, uses jasmine TAP reporter, implicitly turns on option "tap", automatically exit when TAP finishes')
  .option('--mocha', 'Support mocha test, assumes BDD setup, uses TAP reporter, implicitly turns on option "tap", automatically exit when TAP finishes')
  .option('-k, --keep-open', 'Only for --tap, --jasmine and --mocha, leave the browser open for debugging after running tests')
  .on('--help', function(){
    console.log('')
    console.log('Available browsers if installed (for -b, --browser <name>):');
    console.log('  electron (embedded, default choice), chrome, chrome-headless, chromium, chromium-headless, firefox, firefox-headless, ie, edge, safari');
    console.log('');
    console.log('There is some tolerance on browser name, for example:');
    console.log('  -b ChromeHeadless');
    console.log('  -b chromeHeadless');
    console.log('  -b chrome_headless');
    console.log('  -b "chrome headless"');
    console.log('all work just like -b chrome-headless');
  })
  .parse(process.argv);

const tap = opts.tap || opts.tape || opts.jasmine || opts.mocha;

const chunks = [];
const readInput = new Writable({
  write(chunk, enc, cb) {
    chunks.push(chunk);
    cb();
  }
});

process.stdin.pipe(readInput);

readInput.on('finish', () => {
  const data = Buffer.concat(chunks).toString();
  const holdOutput = through();

  const browserDo = run(opts, data, holdOutput);

  // note output stream is piped to two different destinations.
  // 1. tap-parser to deal with tap results
  if (tap) holdOutput.pipe(tapFinished(opts.keepOpen));
  // 2. to stdout
  holdOutput.pipe(process.stdout);

  process.on('exit', () => browserDo.stop());

  process.on('SIGINT', () => {
    // manually call process.exit() so it will trigger 'exit' event.
    process.exit();
  });
});
