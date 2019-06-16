# browser-do

Alternative implementation of [browser-run](https://github.com/juliangruber/browser-run) and [tape-run](https://github.com/juliangruber/tape-run), with better Windows support, plus [mocha](https://mochajs.org), [jasmine](https://jasmine.github.io), [tape](https://github.com/substack/tape) support out of the box.

browser-do offers

1. browser launcher implementation borrowed from various karma browser launchers. Simpler and more reliable on Windows.
2. [TAP output](https://en.wikipedia.org/wiki/Test_Anything_Protocol) support.

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

TODO keep opts same as much as possible, add one option (or make it default) for TAP output.

