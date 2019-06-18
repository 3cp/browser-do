const test = require('tape');
const concat = require('concat-stream');
const run = require('../index');

if (process.platform === 'win32' && process.env['TRAVIS_OS_NAME'] === 'windows') {
  test('travis windows box', t => {
    t.pass('skip browser-do code test on travis-ci windows box')
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
    setTimeout(() => browser.stop(), 6000);
  });
}
