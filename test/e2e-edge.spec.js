import test from 'ava';
import {exec} from 'child_process';

if (process.platform === 'win32') {
  test.serial.cb('browser-do detects passed tape tests', t => {
    exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap -b edge', error => {
      t.falsy(error);
      t.end();
    });
  });

  test.serial.cb('browser-do detects failed tape tests', t => {
    exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap -b edge', error => {
      t.truthy(error);
      t.end();
    });
  });

  test.serial.cb('browser-do detects passed jasmine tests', t => {
    exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine -b edge', error => {
      t.falsy(error);
      t.end();
    });
  });

  test.serial.cb('browser-do detects failed jasmine tests', t => {
    exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine -b edge', error => {
      t.truthy(error);
      t.end();
    });
  });

  test.serial.cb('browser-do detects passed mocha tests', t => {
    exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha -b edge', error => {
      t.falsy(error);
      t.end();
    });
  });

  test.serial.cb('browser-do detects failed mocha tests', t => {
    exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha -b edge', error => {
      t.truthy(error);
      t.end();
    });
  });
}
