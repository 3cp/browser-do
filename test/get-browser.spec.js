const test = require('tape');
const getBrowser = require('../lib/get-browser');

function load(name) {
  if (name === 'safari') {
    return {
      path: {
        darwin: '/mac/safari'
      }
    };
  }

  if (name === 'chrome-headless') {
    return () => ({
      path: {
        linux: '/linux/chrome',
        darwin: '/mac/chrome',
        win32: '/win/chrome.exe'
      },
      args: ['--enable-automation', '--headless', '--disable-gpu']
    });
  }

  throw new Error('not available');
}

function _getBrowser(name) {
  return getBrowser(name, load);
}

test('getBrowser returns nothing for missing browser', t => {
  t.notOk(_getBrowser('na'));
  t.end();
});

if (process.platform === 'linux') {
  test('getBrowser returns nothing missing browser on linux', t => {
    t.notOk(_getBrowser('safari'));
    t.end();
  });

  test('getBrowser gets browser on linux', t => {
    t.deepEqual(_getBrowser('chrome-headless'), {
      args: ['--enable-automation', '--headless', '--disable-gpu'],
      path: '/linux/chrome'
    });
    t.end();
  });
}

if (process.platform === 'darwin') {
  test('getBrowser gets browser on macOS', t => {
    t.deepEqual(_getBrowser('safari'), {
      path: '/mac/safari'
    });

    t.deepEqual(_getBrowser('chrome-headless'), {
      args: ['--enable-automation', '--headless', '--disable-gpu'],
      path: '/mac/chrome'
    });
    t.end();
  });
}

if (process.platform === 'win32') {
  test('getBrowser returns nothing missing browser on win32', t => {
    t.notOk(_getBrowser('safari'));
    t.end();
  });

  test('getBrowser gets browser on win32', t => {
    t.deepEqual(_getBrowser('chrome-headless'), {
      args: ['--enable-automation', '--headless', '--disable-gpu'],
      path: '/win/chrome.exe'
    });
    t.end();
  });
}
