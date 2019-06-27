const test = require('tape');
const concat = require('concat-stream');
const run = require('../index');

// something is not right on travis windows.
// tests here have no issue on a local windows box, but time out on travis windows box.
if (process.platform === 'win32' && process.env['TRAVIS_OS_NAME'] === 'windows') {
  test('travis windows box', t => {
    t.pass('skip browser-do code test on travis-ci windows box');
    t.end();
  });
} else {
  test('browser-do rans javascript code', t => {
    const browser = run();
    browser.pipe(concat(data => {
      t.equal(data.toString(), 'hello\n');
      t.end();
    }));
    browser.on('error', t.fail);
    browser.end('console.log("hello");window.close();');
  });

  test('browser-do rans javascript, close by api', t => {
    const browser = run();
    browser.pipe(concat(data => {
      t.equal(data.toString(), 'hello\n');
      t.end();
    }));
    browser.on('error', t.fail);
    browser.end('console.log("hello");');
    setTimeout(() => browser.stop(), 3000);
  });

  test('browser-do detects tap output, auto close', t => {
    function onCoverage() {
      t.fail('should not trigger onCoverage when there is no window.__coverage__');
    }

    const browser = run({tap: true, onCoverage});
    browser.pipe(concat(data => {
      t.equal(data.toString(), '1..2\nok\nok\n');
      t.end();
    }));
    browser.on('error', t.fail);
    browser.end('console.log("1..2");console.log("ok");console.log("ok");');
  });

  test('browser-do detects tap output, auto close, write coverage report', t => {
    function onCoverage(result) {
      t.equal(result, '{"a":1}');
    }

    const browser = run({tap: true, onCoverage});
    browser.pipe(concat(data => {
      t.equal(data.toString(), '1..2\nok\nok\n');
      t.end();
    }));
    browser.on('error', t.fail);
    browser.end('window.__coverage__ = {a:1};console.log("1..2");console.log("ok");console.log("ok");');
  });
}
