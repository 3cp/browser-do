import test from 'ava';
import concat from 'concat-stream';
import run from '../index';

test.serial.cb('browser-do rans javascript code', t => {
  const browser = run();
  browser.pipe(concat(data => {
    t.is(data.toString(), 'hello\n');
    t.end();
  }));
  browser.on('error', t.fail);
  browser.end('console.log("hello");window.close();');
});

test.serial.cb('browser-do rans javascript, close by api', t => {
  const browser = run();
  browser.pipe(concat(data => {
    t.is(data.toString(), 'hello\n');
    t.end();
  }));
  browser.on('error', t.fail);
  browser.end('console.log("hello");');
  setTimeout(() => browser.stop(), 9000);
});
