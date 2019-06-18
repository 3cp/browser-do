const test = require('tape');
const concat = require('concat-stream');
const run = require('../index');

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
