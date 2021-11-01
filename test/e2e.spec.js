const test = require('tape');
const {exec, execSync} = require('child_process');
const {version} = require('../package.json');
const getBrowser = require('../lib/get-browser');

test('browser-do prints out version number', t => {
  t.equal(execSync('node bin/browser-do.js --version').toString().trim(), version);
  t.end();
});

const browsers = [
  'electron',
  'chrome-headless',
  'chromium-headless',
  'edge-headless',
  'firefox-headless',
  'safari'
];

browsers.forEach(browser => {
  const hasTheBrowser = getBrowser(browser);
  if (hasTheBrowser) {
    const browserArg = ' -b ' + browser;

    if (browser === 'electron') {
      test('browser-do by default uses electron to detect passed tape tests', t => {
        exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap', error => {
          t.notOk(error);
          t.end();
        });
      });

      test('browser-do by default uses electron to detect failed tape tests', t => {
        exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap', error => {
          t.ok(error);
          t.end();
        });
      });
    }

    test(`browser-do:${browser} detects passed tape tests`, t => {
      exec('npx browserify test/samples/_tape-good.js | node bin/browser-do.js --tap' + browserArg, error => {
        t.notOk(error);
        t.end();
      });
    });

    test(`browser-do:${browser} detects failed tape tests`, t => {
      exec('npx browserify test/samples/_tape-bad.js | node bin/browser-do.js --tap' + browserArg, error => {
        t.ok(error);
        t.end();
      });
    });

    test(`browser-do:${browser} detects passed jasmine tests`, t => {
      exec('npx browserify test/samples/_jasmine-good.js | node bin/browser-do.js --jasmine' + browserArg, error => {
        t.notOk(error);
        t.end();
      });
    });

    test(`browser-do:${browser} detects failed jasmine tests`, t => {
      exec('npx browserify test/samples/_jasmine-bad.js | node bin/browser-do.js --jasmine' + browserArg, error => {
        t.ok(error);
        t.end();
      });
    });

    test(`browser-do:${browser} supports jasmine fit tests`, t => {
      exec('npx browserify test/samples/_jasmine-fit.js | node bin/browser-do.js --jasmine' + browserArg, error => {
        t.notOk(error);
        t.end();
      });
    });

    test(`browser-do:${browser} supports jasmine fdescribe tests`, t => {
      exec('npx browserify test/samples/_jasmine-fdescribe.js | node bin/browser-do.js --jasmine' + browserArg, error => {
        t.notOk(error);
        t.end();
      });
    });

    test(`browser-do:${browser} supports jasmine xit tests`, t => {
      exec('npx browserify test/samples/_jasmine-xit.js | node bin/browser-do.js --jasmine' + browserArg, error => {
        t.notOk(error);
        t.end();
      });
    });

    test(`browser-do:${browser} supports jasmine xdescribe tests`, t => {
      exec('npx browserify test/samples/_jasmine-xdescribe.js | node bin/browser-do.js --jasmine' + browserArg, error => {
        t.notOk(error);
        t.end();
      });
    });

    test(`browser-do:${browser} detects passed mocha tests`, t => {
      exec('npx browserify test/samples/_mocha-good.js | node bin/browser-do.js --mocha' + browserArg, error => {
        t.notOk(error);
        t.end();
      });
    });

    test(`browser-do:${browser} detects failed mocha tests`, t => {
      exec('npx browserify test/samples/_mocha-bad.js | node bin/browser-do.js --mocha' + browserArg, error => {
        t.ok(error);
        t.end();
      });
    });

    test(`browser-do:${browser} supports static assets and html input`, t => {
      exec('npx cat test/_jasmine-good.html | node bin/browser-do.js --jasmine --static test/samples' + browserArg, error => {
        t.notOk(error);
        t.end();
      });
    });

    test(`browser-do:${browser} supports static assets and html input, with failed tests`, t => {
      exec('npx cat test/_jasmine-bad.html | node bin/browser-do.js --jasmine --static test/samples' + browserArg, error => {
        t.ok(error);
        t.end();
      });
    });

    test(`browser-do:${browser} supports mock and html input`, t => {
      exec('npx cat test/_mock-jasmine-good.html | node bin/browser-do.js --jasmine --mock test/_mock.js' + browserArg, error => {
        t.notOk(error);
        t.end();
      });
    });

    test(`browser-do:${browser} supports mock and html input, with failed tests`, t => {
      exec('npx cat test/_mock-jasmine-bad.html | node bin/browser-do.js --jasmine --mock test/_mock.js' + browserArg, error => {
        t.ok(error);
        t.end();
      });
    });
  } else {
    test(`bypass ${browser} because it is not present`, t => {
      t.pass(`bypass ${browser} because it is not present`);
      t.end();
    });
  }
});
