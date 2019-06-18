# browser-do [![Build Status](https://travis-ci.org/3cp/browser-do.svg?branch=master)](https://travis-ci.org/3cp/browser-do)

Run JavaScript in a browser, forward browser console log to stdout, great for running unit tests in browser.

```bash
npm i -D browser-do
```

browser-do is an alternative implementation of [browser-run](https://github.com/juliangruber/browser-run) and [tape-run](https://github.com/juliangruber/tape-run), with better Windows support, supports running [mocha](https://mochajs.org), [jasmine](https://jasmine.github.io), [tape](https://github.com/substack/tape) unit tests out of the box.

browser-do offers:

1. Browser detection borrowed from various karma browser launchers. Simpler and more reliable on Windows than [browser-launcher](https://github.com/substack/browser-launcher).
2. [TAP output](http://testanything.org) support.
3. Kept browser-run options `-p, --port`, `-b, --browser browser-name`, `-s, --static`, and `-m, --mock`.
4. Removed `--input html` as browser-do auto detects JavaScript or HTML input.
5. Removed `-n, --node` and `--basedir` as browser-do doesn't want to support Node.js code. (In original browser-run, Node.js code only work with electron anyway)
6. Added options `-t, --tap` to handle generic TAP output.
7. Added `--jasmine` and `--mocha` to conveniently support jasmine/mocha (setup global vars, use TAP reporter).
8. Added `-k, --keep-open` (inherited from tap-run) to keep browser running after TAP finished.

browser-do is simple and flexible to run your unit tests in browsers without any setup. Just pipe your code to browser-do with browser of your choice (default to an invisible electron).

```bash
browserify test/all-my-tape-tests.js | browser-do --tap
browserify test/all-my-jasmine-tests.js | browser-do --jasmine
browserify test/all-my-mocha-tests.js | browser-do --mocha --browser chrome-headless
```

> Note browserify [doesn't support glob](https://github.com/browserify/browserify/pull/1205), that's why we cannot use `browserify 'test/**/*.spec.js'` here.

The browserify step is just an example, you don't have to use browserify with browser-do. You can prepare a JavaScript bundle with any bundler, then just run it with browser-do.

```bash
cat dist/my-test-bundle.js | browser-do --tap # or jasmine/mocha
# or avoid "cat" on windows
browser-do --tap < dist/my-test-bundle.js
```

One more tip, because browser-do normalises tape/jasmine/mocha into TAP output, you can pipe to any TAP [pretty reporters](https://github.com/substack/tape#pretty-reporters)
```bash
browserify test/all-my-jasmine-tests.js | browser-do --jasmine | tap-dot
```

## Supported Browsers

electron is the always available default.

|                    | macOS | Linux | Windows |
|--------------------|-------|-------|---------|
| electron (default) | Yes   | Yes   | Yes     |
| chrome             | Yes   | Yes   | Yes     |
| chrome-headless    | Yes   | Yes   | Yes     |
| chromium           | Yes   | Yes   | Yes     |
| chromium-headless  | Yes   | Yes   | Yes     |
| firefox            | Yes   | Yes   | Yes     |
| firefox-headless   | Yes   | Yes   | Yes     |
| ie                 |       |       | Yes     |
| edge               |       |       | Yes     |
| safari             | Yes   |       |         |

## Usage

```
Usage: browser-do [options]

Options:
  -V, --version         output the version number
  -b, --browser <name>  Browser to use, see available browsers below (default: "electron")
  -p, --port <port>     Starts listening on that port and waits for you to open a browser
  -s, --static <path>   Serve static assets from this directory
  -m, --mock <path>     Path to code to handle requests for mocking a dynamic back-end
  -t, --tap             Treat output as TAP test result, automatically exit when TAP finishes
  --jasmine             Support jasmine test, uses jasmine TAP reporter, implicitly turns on option "tap", automatically exit when TAP finishes
  --mocha               Support mocha test, assumes BDD setup, uses TAP reporter, implicitly turns on option "tap", automatically exit when TAP finishes
  -k, --keep-open       Only for -t, --tap, --jasmine and --mocha, leave the browser open for debugging after running tests
  -h, --help            output usage information

Available browsers if installed (for -b, --browser <name>):
  electron (embedded, default choice), chrome, chrome-headless, chromium, chromium-headless, firefox, firefox-headless, ie, edge, safari

There is some tolerance on browser name, for example:
  -b ChromeHeadless
  -b chromeHeadless
  -b chrome_headless
  -b "chrome headless"
all work just like -b chrome-headless
```

### Custom html file

Your can provide a custom html file for browser-do to use. Keep in mind it always needs to have `<script src="/reporter.js"></script>` above other script tags so browser-do is able to properly forward your `console.log`s etc to the terminal.

> Different from browser-run, you don't need `--input html`, browser-do detects the input automatically.

> You would need to combine custom html file with `--static some-dir` or `--mock mock-code.js` in order to have some way to load your JavaScript code.

### Dynamic back-end mock

By using `--mock mock.js` (or `{ mock: 'mock.js'}` in code) you can provide a custom server-side implementation and handle all requests that are sent to paths beginning with `/mock`

mock.js needs to export a function that accepts `req` and `res` arguments for handling requests.

Example:

```js
module.exports = function(req, res){
  if (req.url === '/mock/echo') {
    req.pipe(res);
  }
};
```

### Run browser-do in code

API: `run(opts)`, all the opts have same meaning as the command line options.

`port`, `browser`, `static`, `mock`, `tap`, `jasmine`, `mocha`, and `keepOpen`.

```js
var run = require('browser-do');

var browser = run();
browser.pipe(process.stdout);
browser.end('console.log(location); window.close()');
```

> Note `window.close()` will quit the default electron browser, but it would not work with some other browsers. Because many browsers reject `window.close()` for a window not opened by JavaScript. (In browser perspective, it opened a URL, although browser-do programmatically did that.)

### Close browser window by code

When using browser-do in code with a browser not electron, you have to close the window manually (only if you didn't use `tap`, `jasmine` or `mocha` option).

```js
var run = require('browser-do');

var browser = run({browser: 'chrome'});
browser.pipe(process.stdout);
browser.end('console.log(location);');

setTimeout(function() { browser.stop(); }, 5000);
```

### Get TAP result by code

Follow example takes unit test JS code from stdin, capture final result (either pass or fail).

```js
var run = require('browser-do');

var browser = run({tap: true}); // or jasmine: true, or mocha: true
process.stdin.pipe(browser).pipe(process.stdout);

browser.on('exit', code => {
  // the code is 0 for passed tests, 1 for failed tests
});
```

> Note browser-do only generates a simple pass/fail result from the whole TAP output. browser-do retains original TAP output, so if you need detailed TAP output parsing, further pipe the stream to [tap-parser](https://github.com/tapjs/tap-parser).

### Unit tests support

browser-do conveniently supports running [mocha](https://mochajs.org), [jasmine](https://jasmine.github.io), [tape](https://github.com/substack/tape) unit tests out of the box.

#### Tape

Tape is easy to support, as it doesn't pollute global variables. All browser-do needs to do is to parse [TAP output](http://testanything.org) and automatically exit when tests finish.

```bash
browserify some-tap-test.js | browser-do -t # or --tap
```

#### Jasmine

browser-do helps jasmine test by setup global vars before running your code.

```
browserify some-jasmine-test.js | browser-do --jasmine
```

You don't need to load jasmine before running your code, browser-do does that automatically, as long as you did `npm i -D jasmine-core`.

FYI, here is the special `index.html` browser-do provided for jasmine. Showing here only to help you to understand how browser-do does the magic.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="/reporter.js"></script>
  <link rel="stylesheet" href="/jasmine-core/jasmine.css">
</head>
<body>
  <script src="/jasmine-core/jasmine.js"></script>
  <script src="/jasmine-core/jasmine-html.js"></script>
  <script src="/jasmine-core/boot.js"></script>
  <script src="/jasmine-tap-reporter.js"></script>
  <script src="/bundle.js"></script> <!-- Your code is loaded here! -->
</body>
</html>
```

#### Mocha

browser-do helps mocha test by setup global vars before running your code.

```
browserify some-mocha-test.js | browser-do --mocha
```

You don't need to load mocha before running your code, browser-do does that automatically, as long as you did `npm i -D mocha`.

FYI, here is the special `index.html` browser-do provided for mocha. Showing here only to help you to understand how browser-do does the magic.

Note we use default BDD style in mocha.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="/reporter.js"></script>
  <link rel="stylesheet" href="/mocha/mocha.css">
</head>
<body>
  <div id="mocha"></div>
  <script src="/mocha/mocha.js"></script>
  <script class="mocha-init">
    mocha.setup({ui: "bdd", reporter: "tap"});
    mocha.checkLeaks();
  </script>
  <script src="/bundle.js"></script> <!-- Your code is loaded here! -->
  <script class="mocha-exec">
    mocha.run();
  </script>
</body>
</html>
```

> The default mocha setup uses "tap" reporter so browser-do can understand tests result.

> **Only for mocha, when `-k, --keep-open` option is on, it switches setup to use "html" reporter.** Because mocha doesn't support multiple reporters, and we want to show user a nice result in browser window. As a result, browser-do cannot detect the final test result in `keepOpen` mode.

If you want to use different setup of mocha, just pipe a custom html file to browser-do

```bash
cat my-mocha-index.html | browser-do --mocha --static .
# or avoid "cat" on windows
browser-do --mocha --static . < my-mocha-index.html
```

In your special html file:

1. you need `<script src="/reporter.js"></script>` above any script tags.
2. you need retain most of the above html file, just modify the mocha setup part.
2. you need something like `<script src="/dist/my-prepared-bundle.js"></script>` to replace `<script src="/bundle.js"></script>`, you need to make sure you generated that bundle file before using browser-do.
3. The `--static .` option is to let browser-do to access all the local files including the `dist/my-prepared-bundle.js`.

## CI setup

To use browser-do on travis, add this to your `.travis.yml`:

```yml
addons:
  apt:
    packages:
      - xvfb
before_install:
  - export DISPLAY=':99.0'
  - Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
```

If you run travis with multiple OS including windows:

```yml
os:
  - linux
  - windows
  - osx
addons:
  apt:
    packages:
      - xvfb
before_install:
before_install:
  - if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then export DISPLAY=':99.0' ; fi
  - if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 & fi
```

## License

browser-do is licensed under the [MIT license](https://github.com/3cp/browser-do/blob/master/LICENSE).

## Acknowledgement

browser-do borrowed code from many projects, details in [ACKNOWLEDGEMENT](https://github.com/3cp/browser-do/blob/master/ACKNOWLEDGEMENT.md).

