const test = require('tape');
const {exec} = require('child_process');
const getBrowser = require('../lib/get-browser');
const hasChromium = getBrowser('chromium-headless');

if (hasChromium) {
  test('browser-do:chromium detects passed tape tests', t => {
    exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap -b chromium-headless', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:chromium detects failed tape tests', t => {
    exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap -b chromium-headless', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:chromium detects passed jasmine tests', t => {
    exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine -b chromium-headless', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:chromium detects failed jasmine tests', t => {
    exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine -b chromium-headless', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:chromium detects passed mocha tests', t => {
    exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha -b chromium-headless', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:chromium detects failed mocha tests', t => {
    exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha -b chromium-headless', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:chromium supports static assets and html input', t => {
    exec('npx cat test/_jasmine-good.html | node bin/browser-do.js --jasmine --static test/samples -b chromium-headless', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:chromium supports static assets and html input, with failed tests', t => {
    exec('npx cat test/_jasmine-bad.html | node bin/browser-do.js --jasmine --static test/samples -b chromium-headless', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:chromium supports mock and html input', t => {
    exec('npx cat test/_mock-jasmine-good.html | node bin/browser-do.js --jasmine --mock test/_mock.js -b chromium-headless', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:chromium supports mock and html input, with failed tests', t => {
    exec('npx cat test/_mock-jasmine-bad.html | node bin/browser-do.js --jasmine --mock test/_mock.js -b chromium-headless', error => {
      t.ok(error);
      t.end();
    });
  });
} else {
  test('bypass chromium because it is not present', t => {
    t.pass('bypass chromium because it is not present');
    t.end();
  });
}