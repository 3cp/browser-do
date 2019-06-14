/* eslint-disable no-console */
const http = require('http');
const path = require('path');
const fs = require('fs');
const enstore = require('enstore');
const xws = require('xhr-write-stream')();
const launch = require('./lib/launch');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const destroyable = require('server-destroy');
const kebabCase = require('lodash.kebabcase');
const getBrowser = require('./lib/get-browser');

const reporterPath = path.join(__dirname, 'dist', 'reporter.js');
try {
  fs.statSync(reporterPath);
} catch (_) {
  console.error('Reporter script missing.');
}

module.exports = function (opts, input, output) {
  if (!opts) opts = {};
  if ('number' == typeof opts) opts = { port: opts };
  if (!opts.browser) opts.browser = 'electron';
  if (!opts.input) opts.input = 'javascript';
  return runner(opts, input, output);
};

function runner (opts, input, output) {
  const browser = getBrowser(kebabCase(opts.browser));

  if (!browser) {
    console.error('No browser found for ' + opts.browser);
    process.exit(1);
  }

  var bundle = enstore();
  input.pipe(bundle.createWriteStream());

  var mockHandler = opts.mock && require(path.resolve('./', opts.mock));

  var server = http.createServer(function (req, res) {
    if (opts.input === 'javascript') {
      if (/^\/bundle\.js/.test(req.url)) {
        res.setHeader('content-type', 'application/javascript');
        res.setHeader('cache-control', 'no-cache');
        bundle.createReadStream().pipe(res);
        return;
      }

      if (req.url == '/') {
        res.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <script src="/reporter.js"></script>
    <script src="/bundle.js"></script>
  </body>
</html>`);
        res.end();
        return;
      }
    } else if (opts.input === 'html') {
      if (req.url == '/') {
        bundle.createReadStream().pipe(res);
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
