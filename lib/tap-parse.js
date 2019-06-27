// Different from https://github.com/tapjs/tap-parser
// This implementation doesn't support subtests, because
// subtests is not in TAP spec v12 or v13, it's in v14 draft
// which only node-tap uses.
// But node-tap does not run in browser, so that's irrelevant.

const readline = require('readline');

module.exports = function(readableStream, cb) {
  const rl = readline.createInterface({
    input: readableStream,
    crlfDelay: Infinity // '\r\n' as single line break.
  });

  function panic(err) {
    cb(err);
  }

  function complete(passed) {
    cb(null, passed);
  }

  let plan = null;
  let tests = [];

  function captureVersion(line) {
    const m = line.match(/^TAP version (\d+)$/);
    if (m) {
      const version = parseInt(m[1], 10);
      if (version < 12 || version > 13) {
        throw new Error('TAP version ' + version + ' is not supported');
      }
      return true;
    }
  }

  function capturePlan(line) {
    const m = line.match(/^1\.\.(\d+)$/);
    if (m) {
      plan = parseInt(m[1], 10);
      return true;
    }
  }

  function captureTest(line) {
    const m = line.match(/^((?:not )?ok)\b/);
    if (m) {
      const pass = m[1] === 'ok';
      const todo = (/# TODO /i).test(line);
      const skip = !todo && (/# SKIP\S*\s+/i).test(line);
      tests.push({pass, todo, skip});
      return true;
    }
  }

  function captureBailout(line) {
    const m = line.match(/^Bail out!/);
    if (m) {
      throw new Error(line);
    }
  }

  rl.on('line', line => {
    if (line.match(/^\s*$/)) return;

    // console.log(' LINE: ' + line);
    try {
      captureVersion(line) ||
      capturePlan(line) ||
      captureTest(line) ||
      captureBailout(line);

      // console.log(' PLAN: ' + plan);
      // console.log(' TESTS: ', tests);
      if (plan && tests.length === plan) {
        complete(tests.every(t => t.pass || t.todo || t.skip));
      }
    } catch (err) {
      panic(err);
    }
  });

  return rl;
};
