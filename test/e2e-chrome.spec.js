const test = require('tape');
const {exec} = require('child_process');

test('browser-do:chrome detects passed tape tests', t => {
  exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap -b chrome-headless', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:chrome detects failed tape tests', t => {
  exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap -b chrome-headless', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:chrome detects passed jasmine tests', t => {
  exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine -b chrome-headless', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:chrome detects failed jasmine tests', t => {
  exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine -b chrome-headless', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:chrome detects passed mocha tests', t => {
  exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha -b chrome-headless', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:chrome detects failed mocha tests', t => {
  exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha -b chrome-headless', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:chrome supports static assets and html input', t => {
  exec('node bin/browser-do.js --jasmine --static test/samples -b chrome-headless < test/_jasmine-good.html', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:chrome supports static assets and html input, with failed tests', t => {
  exec('node bin/browser-do.js --jasmine --static test/samples -b chrome-headless <  test/_jasmine-bad.html', error => {
    t.ok(error);
    t.end();
  });
});

test('browser-do:chrome supports mock and html input', t => {
  exec('node bin/browser-do.js --jasmine --mock test/_mock.js -b chrome-headless <  test/_mock-jasmine-good.html', error => {
    t.notOk(error);
    t.end();
  });
});

test('browser-do:chrome supports mock and html input, with failed tests', t => {
  exec('node bin/browser-do.js --jasmine --mock test/_mock.js -b chrome-headless <  test/_mock-jasmine-bad.html', error => {
    t.ok(error);
    t.end();
  });
});
