# browser-do

Alternative implementation of [browser-run](https://github.com/juliangruber/browser-run) and [tape-run](https://github.com/juliangruber/tape-run), better Windows support, supports running [mocha](https://mochajs.org), [jasmine](https://jasmine.github.io), [tape](https://github.com/substack/tape) unit tests out of the box.

browser-do offers:

1. Browser launcher implementation borrowed from various karma browser launchers. Simpler and more reliable on Windows than [browser-launcher](https://github.com/substack/browser-launcher).
2. [TAP output](https://en.wikipedia.org/wiki/Test_Anything_Protocol) support.
3. Kept browser-run options `-p, --port`, `-b, --browser browser-name`, `-s, --static`, and `-m, --mock`.
4. Removed `--input html` as browser-do auto detects JavaScript or HTML input.
5. Removed `-n, --node` and `--basedir` as browser-do doesn't want to support Nodejs code. (In browser-run, they only work with electron anyway)
6. Added options `-t, --tap` to handle generic TAP output.
7. Added `--jasmine` and `--mocha` to conveniently support jasmine/mocha (setup global vars, use TAP reporter).
8. Added `-k, --keep-open` (inherited from tap-run) to keep browser running after TAP finished.

browser-do is simple and flexible to run your unit tests in browsers without any setup. Just pipe your code to browser-do with browser of your choice (default to an invisible electron).

```bash
browserify test/all-my-tape-tests.js | browser-do --tap
browserify test/all-my-jasmine-tests.js | browser-do --jasmine
browserify test/all-my-mocha-tests.js | browser-do --mocha --browser chrome-headless
```

Note browserify [doesn't support glob](https://github.com/browserify/browserify/pull/1205), that's why we cannot use `browserify 'test/**/*.spec.js'` here.

## Supported Browsers

electron is the always available default.

|                    | macOS | Linux | Windows |
|--------------------|-------|-------|---------|
| chrome             | Yes   | Yes   | Yes     |
| chrome-headless    | Yes   | Yes   | Yes     |
| chromium           | Yes   | Yes   | Yes     |
| chromium-headless  | Yes   | Yes   | Yes     |
| edge               |       |       | Yes     |
| electron (default) | Yes   | Yes   | Yes     |
| firefox            | Yes   | Yes   | Yes     |
| firefox-headless   | Yes   | Yes   | Yes     |
| ie                 |       |       | Yes     |
| safari             | Yes   |       |         |

## Usage

```
Usage: browser-do [options]

Options:
  -V, --version         output the version number
  -b, --browser <name>  Browser to use, see available browsers below (default: "electron")
  -p, --port            Starts listening on that port and waits for you to open a browser
  -s, --static          Serve static assets from this directory
  -m, --mock            Path to code to handle requests for mocking a dynamic back-end
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

### Close


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

