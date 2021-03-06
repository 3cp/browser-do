const fs = require('fs');
const browserify = require('browserify');
const es6ify = require("es6ify");

try {
  fs.mkdirSync('dist');
} catch (e) {
  // ignore
}

browserify('reporter.js')
  .add(es6ify.runtime)
  .transform(es6ify)
  .bundle()
  .pipe(fs.createWriteStream('dist/reporter.js'));
