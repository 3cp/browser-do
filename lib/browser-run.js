/* eslint-disable no-console */
const http = require('http');
const path = require('path');
const fs = require('fs');
const socketIo = require('socket.io');
const launch = require('./launch');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const destroyable = require('server-destroy');
const kebabCase = require('lodash.kebabcase');
const getBrowser = require('./get-browser');
const once = require('lodash.once');
const c = require('ansi-colors');

const reporterPath = path.join(__dirname, '..', 'dist', 'reporter.js');
const jasmineTapReporterPath = path.join(__dirname, '..', 'jasmine-tap-reporter.js');

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
  const browserName = kebabCase(opts.browser);
  const browser = getBrowser(browserName);

  if (!browser) {
    console.error('No browser found for ' + opts.browser);
    process.exit(1);
  }

  const isHtmlData = data.match(/^\s*</);

  let jasminePath;
  let mochaPath;
  if (opts.jasmine) {
    try {
      jasminePath = path.dirname(require.resolve('jasmine-core/lib/jasmine-core/jasmine.js'));
    } catch (e) {
      console.error('To use --jasmine, you need "npm i -D jasmine-core"');
      process.exit(1);
    }
  }
  if (opts.mocha) {
    try {
      mochaPath = path.dirname(require.resolve('mocha/mocha.js'));
    } catch (e) {
      console.error('To use --mocha, you need "npm i -D mocha"');
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
        }

        if (opts.mocha) {
          res.write('<link rel="stylesheet" href="/mocha/mocha.css">');
          if (browserName === 'ie') {
            res.write('<script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>');
          }
        }

        res.write('</head><body>');

        if (opts.jasmine) {
          res.write('<script src="/jasmine-core/jasmine.js"></script>');
          res.write('<script src="/jasmine-core/jasmine-html.js"></script>');
          res.write('<script src="/jasmine-core/boot.js"></script>');
          res.write('<script src="/jasmine-tap-reporter.js"></script>');
        }

        if (opts.mocha) {
          res.write('<div id="mocha"></div>');
          res.write('<script src="/mocha/mocha.js"></script>');
          res.write(`<script class="mocha-init">
  mocha.setup({ui: "bdd", reporter: "${opts.keepOpen ? "html" : "tap"}"});
</script>`);
        }

        res.write('<script src="/bundle.js"></script>');

        if (opts.mocha) {
          res.write('<script class="mocha-exec">mocha.run();</script>');
        }

        res.end('</body></html>');
        return;
      }
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

    const m2 = req.url.match(/^\/mocha\/(.+)/);

    if (m2) {
      const fn = m2[1];
      if (path.extname(fn) === '.js') {
        res.setHeader('content-type', 'application/javascript');
      } else if (path.extname(fn) === '.css') {
        res.setHeader('content-type', 'text/css');
      }

      fs.createReadStream(path.join(mochaPath, fn)).pipe(res);
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

  const io = socketIo(server, {
    // Use large timeout to cater huge test file.
    pingTimeout: 50000,
    pingInterval: 500000,
    upgradeTimeout: 50000,
    cookie: false
  });

  let coverage;
  io.on('connection', socket => {
    socket.on('log', msg => output.write(msg + '\n'));
    socket.on('debug', msg => console.info(c.bgWhite(msg)));
    socket.on('info', msg => console.info(c.bgCyan(msg)));
    socket.on('warn', msg => console.warn(c.bgYellow(msg)));
    socket.on('error', msg => console.error(c.bgRed(msg)));
    socket.on('coverage', msg => coverage = msg);
  });

  destroyable(server);

  let browserProc;

  if (opts.port) {
    server.listen(opts.port);
    console.log('Web server is up at http://localhost:' + opts.port);
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

      browserProc.on('exit', stop);
    });
  }

  const stop = once(function() {
    try {
      output.end();
      server.destroy();
    } catch (err) {
      // ignore
      console.error(err);
    }

    if (browserProc && !browserProc.killed) browserProc.kill();
  });

  const askCoverage = once(function() {
    try {
      io.emit('ask-coverage');
    } catch(e) {
      // ignore
    }
  });

  function checkCoverage(cb) {
    if (cb && coverage) {
      cb(coverage);
    }
  }

  return {stop, askCoverage, checkCoverage};
}
