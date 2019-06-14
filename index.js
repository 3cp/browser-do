/* eslint-disable no-console */
const http = require('http');
const path = require('path');
const fs = require('fs');
const xws = require('xhr-write-stream')();
const launch = require('./lib/launch');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const destroyable = require('server-destroy');
const kebabCase = require('lodash.kebabcase');
const getBrowser = require('./lib/get-browser');

const reporterPath = path.join(__dirname, 'dist', 'reporter.js');
const jasmineTapReporterPath = path.join(__dirname, 'jasmine-tap-reporter.js');
try {
  fs.statSync(reporterPath);
} catch (_) {
  console.error('Reporter script missing.');
}

module.exports = function (opts, data, output) {
  if (!opts) opts = {};
  if ('number' == typeof opts) opts = { port: opts };
  if (!opts.browser) opts.browser = 'electron';
  return runner(opts, data, output);
};

function runner (opts, data, output) {
  const browser = getBrowser(kebabCase(opts.browser));

  if (!browser) {
    console.error('No browser found for ' + opts.browser);
    process.exit(1);
  }

  const isHtmlData = data.match(/^\s*</);

  let jasminePath;
  if (!isHtmlData && opts.jasmine) {
    try {
      jasminePath = path.dirname(require.resolve('jasmine-core/lib/jasmine-core/jasmine.js'));
    } catch (e) {
      console.error('To use -j/--jasmine, you need "npm i -D jasmine-core"');
      process.exit(1);
    }
  }

  var mockHandler = opts.mock && require(path.resolve('./', opts.mock));

  var server = http.createServer(function (req, res) {
    if (isHtmlData) {
      if (req.url == '/') {
        res.end(data);
        return;
      }
    } else {
      // JavaScript data
      if (/^\/bundle\.js/.test(req.url)) {
        res.setHeader('content-type', 'application/javascript');
        res.setHeader('cache-control', 'no-cache');
        res.end(data);
        return;
      }

      if (req.url == '/') {
        res.write('<!DOCTYPE html><html><head><meta charset="utf-8">');
        res.write('<script src="/reporter.js"></script>');

        if (opts.jasmine) {
          res.write('<link rel="stylesheet" href="/jasmine-core/jasmine.css">');
          res.write('<script src="/jasmine-core/jasmine.js"></script>');
          res.write('<script src="/jasmine-core/jasmine-html.js"></script>');
          res.write('<script src="/jasmine-core/boot.js"></script>');
          res.write('<script src="/jasmine-tap-reporter.js"></script>');
        }

        res.write('<script src="/bundle.js"></script>');
        res.end('</head><body></body></html>');
        return;
      }
    }

    if (req.url == '/xws') {
      req.pipe(xws(function (stream) {
        stream.pipe(output);
      }));
      return req.on('end', res.end.bind(res));
    }

    if (req.url == '/reporter.js') {
      res.setHeader('content-type', 'application/javascript');
      fs.createReadStream(reporterPath).pipe(res);
      return;
    }

    if (req.url == '/jasmine-tap-reporter.js') {
      res.setHeader('content-type', 'application/javascript');
      fs.createReadStream(jasmineTapReporterPath).pipe(res);
      return;
    }

    const m = req.url.match(/^\/jasmine-core\/(.+)/);

    if (m) {
      const fn = m[1];
      if (path.extname(fn) === '.js') {
        res.setHeader('content-type', 'application/javascript');
      } else if (path.extname(fn) === '.css') {
        res.setHeader('content-type', 'text/css');
      }

      fs.createReadStream(path.join(jasminePath, fn)).pipe(res);
      return;
    }

    if (req.url == '/jasmine-core/jasmine-html.js') {
      res.setHeader('content-type', 'application/javascript');
      fs.createReadStream(jasmineHtmlPath).pipe(res);
      return;
    }

    if (req.url == '/jasmine-core/boot.js') {
      res.setHeader('content-type', 'application/javascript');
      fs.createReadStream(jasmineBootPath).pipe(res);
      return;
    }

    if (opts.static) {
      serveStatic(opts.static)(req, res, finalhandler(req, res));
      return;
    }

    if (mockHandler && '/mock' === req.url.substr(0,5)){
      return mockHandler(req, res);
    }

    res.end('not supported');
  });
  destroyable(server);

  let browserProc;

  if (opts.port) {
    server.listen(opts.port);
  } else {
    server.listen(function () {
      var address = server.address();
      if (!address) return; // already closed
      var port = address.port;

      try {
        browserProc = launch('http://localhost:' + port, browser);
      } catch (err) {
        stop();
        console.error(err);
        process.exit(1);
      }

      browserProc.on('exit', (code, signal) => {
        try {
          server.destroy();
        } catch (e) {
          // ignore
        }
      });
    });
  }

  function stop() {
    try {
      server.destroy();
    } catch (e) {
      // ignore
    }
    if (browserProc) browserProc.kill();
  };

  return {stop};
}
