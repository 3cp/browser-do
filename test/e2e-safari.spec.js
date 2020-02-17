const test = require('tape');
const {exec} = require('child_process');

if (process.platform === 'darwin') {
  test('browser-do:safari detects passed tape tests', t => {
    exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap -b safari', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:safari detects failed tape tests', t => {
    exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap -b safari', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:safari detects passed jasmine tests', t => {
    exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine -b safari', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:safari detects failed jasmine tests', t => {
    exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine -b safari', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:safari detects passed mocha tests', t => {
    exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha -b safari', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:safari detects failed mocha tests', t => {
    exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha -b safari', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:safari supports static assets and html input', t => {
    exec('node bin/browser-do.js --jasmine --static test/samples -b safari < test/_jasmine-good.html', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:safari supports static assets and html input, with failed tests', t => {
    exec('node bin/browser-do.js --jasmine --static test/samples -b safari < test/_jasmine-bad.html', error => {
      t.ok(error);
      t.end();
    });
  });

  test('browser-do:safari supports mock and html input', t => {
    exec('node bin/browser-do.js --jasmine --mock test/_mock.js -b safari < test/_mock-jasmine-good.html', error => {
      t.notOk(error);
      t.end();
    });
  });

  test('browser-do:safari supports mock and html input, with failed tests', t => {
    exec('node bin/browser-do.js --jasmine --mock test/_mock.js -b safari < test/_mock-jasmine-bad.html', error => {
      t.ok(error);
      t.end();
    });
  });
} else {
  test('bypass safari on non-mac platform', t => {
    t.pass('bypass safari on non-mac platform');
    t.end();
  });
}
