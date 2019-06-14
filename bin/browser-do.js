#!/usr/bin/env node

const run = require('../index');
const optimist = require('optimist');
const through = require('through');
const {Writable} = require('stream');
const tapFinished = require('../lib/tap-finished');

const argv = optimist
  .usage(
    'Run JavaScript in a browser.\n' +
    'Write code to stdin and receive console output on stdout.\n' +
    'Usage: $0 [OPTIONS]'
  )

  .describe('browser', 'Browser to use. '
      + 'Always available: electron. '
      + 'Available if installed: '
      + 'chrome, chrome-headless, chromium, chromium-headless, firefox, firefox-headless, ie, edge, safari')
  .alias('browser', 'b')
  .default('browser', 'electron')

  .describe('port', 'Starts listening on that port and waits for you to open a browser')
  .alias('p', 'port')

  .describe('static', 'Serve static assets from this directory')
  .alias('s', 'static')

  .describe('mock', 'Path to code to handle requests for mocking a dynamic back-end')
  .alias('m', 'mock')

  .describe('tap', 'Treat output as TAP test result, automatically exit when TAP finishes')
  .alias('t', 'tap')

  .describe('jasmine', 'Support jasmine test, convert jasmine output into TAP result, implicitly turns on option "tap", automatically exit when TAP finishes')
  .alias('j', 'jasmine')

  .describe('keep-open', 'Only for --tap and --jasmine, leave the browser open for debugging after running tests')
  .alias('k', 'keep-open')

  .describe('help', 'Print help')
  .alias('h', 'help')

  .argv;

if (argv.help) {
  optimist.showHelp();
  process.exit();
}

const chunks = [];
const readInput = new Writable({
  write(chunk, enc, cb) {
    chunks.push(chunk);
    cb();
  }
});

process.stdin.pipe(readInput);

readInput.on('finish', () => {
  const input = Buffer.concat(chunks).toString();
  const holdOutput = through();

  const browserDo = run(argv, input, holdOutput);

  // note output stream is piped to two different destinations.
  // 1. tap-parser to deal with tap results
  if (argv.tap || argv.jasmine) holdOutput.pipe(tapFinished(argv['keep-open']));
  // 2. to stdout
  holdOutput.pipe(process.stdout);

  process.on('exit', () => browserDo.stop());

  process.on('SIGINT', () => {
    // manually call process.exit() so it will trigger 'exit' event.
    process.exit();
  });
});
