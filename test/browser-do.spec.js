const {test} = require('zora');
const concat = require('concat-stream');
const run = require('../index');

test('browser-do rans javascript code', async t => {
  return new Promise(resolve => {
    const browser = run();
    browser.pipe(concat(data => {
      t.equal(data.toString(), 'hello\n');
      resolve();
    }));
    browser.on('error', err => {
      t.fail(err.message);
      resolve();
    });
    browser.end('console.log("hello");window.close();');
  });
});

test('browser-do rans javascript, close by api', async t => {
  return new Promise(resolve => {
    const browser = run();
    browser.pipe(concat(data => {
      t.equal(data.toString(), 'hello\n');
      resolve();
    }));
    browser.on('error', err => {
      t.fail(err.message);
      resolve();
    });
    browser.end('console.log("hello");');
    setTimeout(() => browser.stop(), 4000);
  });
});

test('browser-do detects tap output, auto close', async t => {
  function onCoverage() {
    t.fail('should not trigger onCoverage when there is no window.__coverage__');
  }

  return new Promise(resolve => {
    const browser = run({tap: true, onCoverage});
    browser.pipe(concat(data => {
      t.equal(data.toString(), '1..2\nok\nok\n');
      resolve();
    }));
    browser.on('error', err => {
      t.fail(err.message);
      resolve();
    });
    browser.end('console.log("1..2");console.log("ok");console.log("ok");');
  });
});

test('browser-do detects tap output, auto close, write coverage report', async t => {
  function onCoverage(result) {
    t.equal(result, '{"a":1}');
  }

  return new Promise(resolve => {
    const browser = run({tap: true, onCoverage});
    browser.pipe(concat(data => {
      t.equal(data.toString(), '1..2\nok\nok\n');
      resolve();
    }));
    browser.on('error', err => {
      t.fail(err.message);
      resolve();
    });
    browser.end('window.__coverage__ = {a:1};console.log("1..2");console.log("ok");console.log("ok");');
  });
});
