const TapParser = require('tap-parser');

module.exports = function(keepOpen) {
  const parser = new TapParser(results => {
    if (keepOpen) return;
    process.exit(results.ok ? 0 : 1);
  });

  parser.on('bailout', m => {
    console.error(m); // eslint-disable-line no-console
    process.exit(1);
  });

  let count, done = 0;
  parser.on('plan', p => {
    count = p.end - p.start + 1;
    check();
  });

  parser.on('assert', () => {
    done++;
    check();
  });

  let finished = false;
  function check() {
    if (finished) return;
    if (!count || done < count) return;
    finished = true;
    setTimeout(() => parser.end(), 1000);
  }

  return parser;
};
