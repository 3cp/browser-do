const test = require('tape');
const {exec} = require('child_process');

if (process.platform === 'win32') {
  test('browser-do:ie detects passed tape tests', t => {
    exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap -b ie', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:ie detects failed tape tests', t => {
    exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap -b ie', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:ie detects passed jasmine tests', t => {
    exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine -b ie', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:ie detects failed jasmine tests', t => {
    exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine -b ie', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:ie detects passed mocha tests', t => {
    exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha -b ie', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:ie detects failed mocha tests', t => {
    exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha -b ie', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:ie supports static assets and html input', t => {
    exec('npx cat test/_jasmine-good.html | node bin/browser-do.js --jasmine --static test/samples -b ie', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:ie supports static assets and html input, with failed tests', t => {
    exec('npx cat test/_jasmine-bad.html | node bin/browser-do.js --jasmine --static test/samples -b ie', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:ie supports mock and html input', t => {
    exec('npx cat test/_mock-jasmine-good.html | node bin/browser-do.js --jasmine --mock test/_mock.js -b ie', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:ie supports mock and html input, with failed tests', t => {
    exec('npx cat test/_mock-jasmine-bad.html | node bin/browser-do.js --jasmine --mock test/_mock.js -b ie', error => {
      t.ok(error);
      t.end();
    });
  });
} else {
  test('bypass ie on non-win32 platform', t => {
    t.pass('bypass ie on non-win32 platform and travis-ci windows box');
    t.end();
  });
}
