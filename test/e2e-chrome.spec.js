import test from 'ava';
import {exec} from 'child_process';

test.serial.cb('browser-do detects passed tape tests', t => {
  exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap -b chrome-headless', error => {
    t.falsy(error);
    t.end();
  });
});

test.serial.cb('browser-do detects failed tape tests', t => {
  exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap -b chrome-headless', error => {
    t.truthy(error);
    t.end();
  });
});

test.serial.cb('browser-do detects passed jasmine tests', t => {
  exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine -b chrome-headless', error => {
    t.falsy(error);
    t.end();
  });
});

test.serial.cb('browser-do detects failed jasmine tests', t => {
  exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine -b chrome-headless', error => {
    t.truthy(error);
    t.end();
  });
});

test.serial.cb('browser-do detects passed mocha tests', t => {
  exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha -b chrome-headless', error => {
    t.falsy(error);
    t.end();
  });
});

test.serial.cb('browser-do detects failed mocha tests', t => {
  exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha -b chrome-headless', error => {
    t.truthy(error);
    t.end();
  });
});
