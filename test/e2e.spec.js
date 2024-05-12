const {test} = require('zora');
const {exec, execSync} = require('child_process');
const {version} = require('../package.json');
const getBrowser = require('../lib/get-browser');

const nodeMajorVersion = parseInt(process.version.split('.')[0].substring(1), 10);

test('browser-do prints out version number', t => {
  t.equal(execSync('node bin/browser-do.js --version').toString().trim(), version);
});

test('In browsers', async t => {
  const browsers = [
    'electron',
    'chrome-headless',
    'chromium-headless',
    'edge-headless',
    'firefox-headless',
    'safari'
  ];

  for (const browser of browsers) {
    const hasTheBrowser = getBrowser(browser);
    if (hasTheBrowser) {
      const browserArg = ' -b ' + browser;

      if (browser === 'electron') {
        await t.test('browser-do by default uses electron to detect passed zora tests', async t => {
          return new Promise(resolve => {
            exec('npx cat test-samples-dist/_zora-good.js | node bin/browser-do.js --tap', error => {
              t.notOk(error);
              resolve();
            });
          });
        });

        await t.test('browser-do by default uses electron to detect failed zora tests', async t => {
          return new Promise(resolve => {
            exec('npx cat test-samples-dist/_zora-bad.js | node bin/browser-do.js --tap', error => {
              t.ok(error);
              resolve();
            });
          });
        });
      }

      await t.test(`browser-do:${browser} detects passed zora tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test-samples-dist/_zora-good.js | node bin/browser-do.js --tap' + browserArg, error => {
            t.notOk(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} detects failed zora tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test-samples-dist/_zora-bad.js | node bin/browser-do.js --tap' + browserArg, error => {
            t.ok(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} detects passed jasmine tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test-samples-dist/_jasmine-good.js | node bin/browser-do.js --jasmine' + browserArg, error => {
            t.notOk(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} detects failed jasmine tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test-samples-dist/_jasmine-bad.js | node bin/browser-do.js --jasmine' + browserArg, error => {
            t.ok(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} supports jasmine fit tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test-samples-dist/_jasmine-fit.js | node bin/browser-do.js --jasmine' + browserArg, error => {
            t.notOk(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} supports jasmine fdescribe tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test-samples-dist/_jasmine-fdescribe.js | node bin/browser-do.js --jasmine' + browserArg, error => {
            t.notOk(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} supports jasmine xit tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test-samples-dist/_jasmine-xit.js | node bin/browser-do.js --jasmine' + browserArg, error => {
            t.notOk(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} supports jasmine xdescribe tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test-samples-dist/_jasmine-xdescribe.js | node bin/browser-do.js --jasmine' + browserArg, error => {
            t.notOk(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} detects passed mocha tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test-samples-dist/_mocha-good.js | node bin/browser-do.js --mocha' + browserArg, error => {
            t.notOk(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} detects failed mocha tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test-samples-dist/_mocha-bad.js | node bin/browser-do.js --mocha' + browserArg, error => {
            t.ok(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} supports static assets and html input`, async t => {
        return new Promise(resolve => {
          exec('npx cat test/_jasmine-good.html | node bin/browser-do.js --jasmine --static test-samples-dist' + browserArg, error => {
            t.notOk(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} supports static assets and html input, with failed tests`, async t => {
        return new Promise(resolve => {
          exec('npx cat test/_jasmine-bad.html | node bin/browser-do.js --jasmine --static test-samples-dist' + browserArg, error => {
            t.ok(error);
            resolve();
          });
        });
      });

      await t.test(`browser-do:${browser} supports mock and html input`, async t => {
        return new Promise(resolve => {
          exec('npx cat test/_mock-jasmine-good.html | node bin/browser-do.js --jasmine --mock test/_mock.js' + browserArg, error => {
            t.notOk(error);
            resolve();
          });
        });
      });

      if (browser === 'firefox-headless' && process.platform === 'win32' && nodeMajorVersion < 16) {
        await t.test(`browser-do:${browser} supports mock and html input, with failed tests. Bypassed on Windows Nodejs v${nodeMajorVersion} because of intermittent failure. Assume Nodejs v16 fixed some bug.`, t => {
          t.ok(true, `browser-do:${browser} supports mock and html input, with failed tests. Bypassed on Windows Nodejs v${nodeMajorVersion} because of intermittent failure. Assume Nodejs v16 fixed some bug.`);
        });
      } else {
        await t.test(`browser-do:${browser} supports mock and html input, with failed tests`, async t => {
          return new Promise(resolve => {
            exec('npx cat test/_mock-jasmine-bad.html | node bin/browser-do.js --jasmine --mock test/_mock.js' + browserArg, error => {
              t.ok(error);
              resolve();
            });
          });
        });
      }
    } else {
      await t.test(`bypass ${browser} because it is not present`, t => {
        t.ok(true, `bypass ${browser} because it is not present`);
      });
    }
  }
});