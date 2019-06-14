#!/usr/bin/env node

var run = require('../index');
var optimist = require('optimist');
const TapParser = require('tap-parser');
const through = require('through');

var argv = optimist
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

  .describe('input', 'Input type. Defaults to \'javascript\', can be set to \'html\'.')
  .alias('i', 'input')

  .describe('keep-open', 'Leave the browser open for debugging after running tests. This is only needed for dealing with TAP test result.')
  .alias('k', 'keep-open')
  .alias('keepOpen', 'keep-open')

  .describe('help', 'Print help')
  .alias('h', 'help')

  .argv;

if (argv.help) {
  optimist.showHelp();
  process.exit();
}

const holdOutput = through();

const browserDo = run(argv, process.stdin, holdOutput);

const parser = new TapParser(results => {
  if (!argv.keepOpen) {
    process.exit(results.ok ? 0 : 1);
  }
});

parser.on('bailout', m => {
  console.error(m); // eslint-disable-line no-console
  process.exit(1);
});

let count, done = 0;
parser.on('plan', p => {
  count = p.end - p.start + 1;
  check();
});

parser.on('assert', () => {
  done++;
  check();
});

let finished = false;
function check() {
  if (finished) return;
  if (!count || done < count) return;
  finished = true;
  setTimeout(() => parser.end(), 1000);
}

// note output stream is piped to two different consumers.
// 1. tap-parser to deal with tap results
holdOutput.pipe(parser);
// 2. to stdout
holdOutput.pipe(process.stdout);

process.on('exit', () => browserDo.stop());

process.on('SIGINT', () => {
  // manually call process.exit() so it will trigger 'exit' event.
  process.exit();
});
