const test = require('tape');
const {exec} = require('child_process');
const getBrowser = require('../lib/get-browser');
const hasEdge = getBrowser('edge-headless');

if (hasEdge) {
  test('browser-do:edge detects passed tape tests', t => {
    exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap -b edge-headless', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:edge detects failed tape tests', t => {
    exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap -b edge-headless', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:edge detects passed jasmine tests', t => {
    exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine -b edge-headless', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:edge detects failed jasmine tests', t => {
    exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine -b edge-headless', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:edge detects passed mocha tests', t => {
    exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha -b edge-headless', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:edge detects failed mocha tests', t => {
    exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha -b edge-headless', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:edge supports static assets and html input', t => {
    exec('npx cat test/_jasmine-good.html | node bin/browser-do.js --jasmine --static test/samples -b edge-headless', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:edge supports static assets and html input, with failed tests', t => {
    exec('npx cat test/_jasmine-bad.html | node bin/browser-do.js --jasmine --static test/samples -b edge-headless', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:edge supports mock and html input', t => {
    exec('npx cat test/_mock-jasmine-good.html | node bin/browser-do.js --jasmine --mock test/_mock.js -b edge-headless', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:edge supports mock and html input, with failed tests', t => {
    exec('npx cat test/_mock-jasmine-bad.html | node bin/browser-do.js --jasmine --mock test/_mock.js -b edge-headless', error => {
      t.ok(error);
      t.end();
    });
  });
} else {
  test('bypass edge because it is not present', t => {
    t.pass('bypass edge because it is not present');
    t.end();
  });
}
