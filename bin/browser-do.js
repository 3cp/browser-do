#!/usr/bin/env node
/* eslint-disable no-console */

const opts = require('commander');
const fs = require('fs');
const path = require('path');
const browserDo = require('../index');

opts
  .version(require('../package.json').version)
  .option('-b, --browser <name>', 'Browser to use, see available browsers below', 'electron')
  .option('-p, --port <port>', 'Starts listening on that port and waits for you to open a browser')
  .option('-s, --static <path>', 'Serve static assets from this directory')
  .option('-m, --mock <path>', 'Path to code to handle requests for mocking a dynamic back-end')
  .option('-t, --tap', 'Treat output as TAP test result, automatically exit when TAP finishes')
  .option('--jasmine', 'Support jasmine test, uses jasmine TAP reporter, implicitly turns on option "tap", automatically exit when TAP finishes')
  .option('--mocha', 'Support mocha test, assumes BDD setup, uses TAP reporter, implicitly turns on option "tap", automatically exit when TAP finishes')
  .option('-k, --keep-open', 'Only for -t, --tap, --jasmine and --mocha, leave the browser open for debugging after running tests')
  .addHelpText('after', `
Available browsers if installed (for -b, --browser <name>):
  electron (embedded, default choice), chrome, chrome-headless, chromium, chromium-headless, firefox, firefox-headless, edge, edge-headless, safari

There is some tolerance on browser name, for example:
  -b ChromeHeadless
  -b chromeHeadless
  -b chrome_headless
  -b "chrome headless"
all work just like -b chrome-headless
`)
  .parse(process.argv);

function onCoverage(result) {
  if (!result) return;

  try {
    fs.mkdirSync('.nyc_output');
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }

  fs.writeFileSync(path.join('.nyc_output', 'out.json'), result);
  console.log('# code coverage is written to .nyc_output/out.json\n' +
    '# you can use "npx nyc report --reporter=lcov --reporter=text"\n' +
    '# then view coverage/lcov-report/index.html in a browser\n');
}

const options = opts.opts();
options.onCoverage = onCoverage;

const run = browserDo(options);
process.stdin
  .pipe(run)
  .pipe(process.stdout);

run.on('exit', code => process.exit(code));
process.on('exit', () => run.stop());

process.on('SIGINT', () => {
  // manually call process.exit() so it will trigger 'exit' event.
  process.exit(run.failed ? 1 : 0);
});
