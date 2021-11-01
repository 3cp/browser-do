const fs = require('fs');
const browserify = require('browserify');

try {
  fs.mkdirSync('dist');
} catch (e) {
  // ignore
}

browserify('reporter.js',)
  .bundle()
  .pipe(fs.createWriteStream('dist/reporter.js'));
