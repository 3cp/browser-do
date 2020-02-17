const test = require('tape');
const {exec} = require('child_process');
const cat = require('./_cat');

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
  exec(cat + ' test/_jasmine-good.html | node bin/browser-do.js --jasmine --static test/samples -b firefox-headless', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:firefox supports static assets and html input, with failed tests', t => {
  exec(cat + ' test/_jasmine-bad.html | node bin/browser-do.js --jasmine --static test/samples -b firefox-headless', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:firefox supports mock and html input', t => {
  exec(cat + ' test/_mock-jasmine-good.html | node bin/browser-do.js --jasmine --mock test/_mock.js -b firefox-headless', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:firefox supports mock and html input, with failed tests', t => {
  exec(cat + ' test/_mock-jasmine-bad.html | node bin/browser-do.js --jasmine --mock test/_mock.js -b firefox-headless', error => {
    t.ok(error);
    t.end();
  });
});

