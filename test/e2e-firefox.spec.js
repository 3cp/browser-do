const test = require('tape');
const {exec} = require('child_process');

test('browser-do:firefox detects passed tape tests', t => {
  exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap -b firefox-headless', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:firefox detects failed tape tests', t => {
  exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap -b firefox-headless', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:firefox detects passed jasmine tests', t => {
  exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine -b firefox-headless', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:firefox detects failed jasmine tests', t => {
  exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine -b firefox-headless', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:firefox detects passed mocha tests', t => {
  exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha -b firefox-headless', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:firefox detects failed mocha tests', t => {
  exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha -b firefox-headless', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:firefox supports static assets and html input', t => {
  exec('node bin/browser-do.js --jasmine --static test/samples -b firefox-headless <  test/_jasmine-good.html', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:firefox supports static assets and html input, with failed tests', t => {
  exec('node bin/browser-do.js --jasmine --static test/samples -b firefox-headless <  test/_jasmine-bad.html', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:firefox supports mock and html input', t => {
  exec('node bin/browser-do.js --jasmine --mock test/_mock.js -b firefox-headless <  test/_mock-jasmine-good.html', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:firefox supports mock and html input, with failed tests', t => {
  exec('node bin/browser-do.js --jasmine --mock test/_mock.js -b firefox-headless <  test/_mock-jasmine-bad.html', error => {
    t.ok(error);
    t.end();
  });
});

