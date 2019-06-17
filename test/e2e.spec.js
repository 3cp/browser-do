import test from 'ava';
import {exec, execSync} from 'child_process';
import {version} from '../package.json';

test.serial('browser-do prints out version number', t => {
  t.is(execSync('node bin/browser-do.js --version').toString().trim(), version);
});

test.serial.cb('browser-do detects passed tape tests', t => {
  exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap', error => {
    t.falsy(error);
    t.end();
  });
});

test.serial.cb('browser-do detects failed tape tests', t => {
  exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap', error => {
    t.truthy(error);
    t.end();
  });
});

test.serial.cb('browser-do detects passed jasmine tests', t => {
  exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine', error => {
    t.falsy(error);
    t.end();
  });
});

test.serial.cb('browser-do detects failed jasmine tests', t => {
  exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine', error => {
    t.truthy(error);
    t.end();
  });
});

test.serial.cb('browser-do detects passed mocha tests', t => {
  exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha', error => {
    t.falsy(error);
    t.end();
  });
});

test.serial.cb('browser-do detects failed mocha tests', t => {
  exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha', error => {
    t.truthy(error);
    t.end();
  });
});

test.serial.cb('browser-do supports static assets and html input', t => {
  exec('cat test/_jasmine-good.html | node bin/browser-do.js --jasmine --static test/samples', error => {
    t.falsy(error);
    t.end();
  });
});

test.serial.cb('browser-do supports static assets and html input, with failed tests', t => {
  exec('cat test/_jasmine-bad.html | node bin/browser-do.js --jasmine --static test/samples', error => {
    t.truthy(error);
    t.end();
  });
});

test.serial.cb('browser-do supports mock and html input', t => {
  exec('cat test/_mock-jasmine-good.html | node bin/browser-do.js --jasmine --mock test/_mock.js', error => {
    t.falsy(error);
    t.end();
  });
});

test.serial.cb('browser-do supports mock and html input, with failed tests', t => {
  exec('cat test/_mock-jasmine-bad.html | node bin/browser-do.js --jasmine --mock test/_mock.js', error => {
    t.truthy(error);
    t.end();
  });
});
