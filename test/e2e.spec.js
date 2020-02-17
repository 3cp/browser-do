const test = require('tape');
const {exec, execSync} = require('child_process');
const {version} = require('../package.json');
const cat = require('./_cat');

test('browser-do:electron prints out version number', t => {
  t.equal(execSync('node bin/browser-do.js --version').toString().trim(), version);
  t.end();
});

test('browser-do:electron detects passed tape tests', t => {
  exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:electron detects failed tape tests', t => {
  exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:electron detects passed jasmine tests', t => {
  exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:electron detects failed jasmine tests', t => {
  exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:electron detects passed mocha tests', t => {
  exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:electron detects failed mocha tests', t => {
  exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:electron supports static assets and html input', t => {
  exec(cat + ' test/_jasmine-good.html | node bin/browser-do.js --jasmine --static test/samples', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:electron supports static assets and html input, with failed tests', t => {
  exec(cat + ' test/_jasmine-bad.html | node bin/browser-do.js --jasmine --static test/samples', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:electron supports mock and html input', t => {
  exec(cat + ' test/_mock-jasmine-good.html | node bin/browser-do.js --jasmine --mock test/_mock.js', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:electron supports mock and html input, with failed tests', t => {
  exec(cat + ' test/_mock-jasmine-bad.html | node bin/browser-do.js --jasmine --mock test/_mock.js', error => {
    t.ok(error);
    t.end();
  });
});
