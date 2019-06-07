# browser-do

Alternative implementation of [browser-run](https://github.com/juliangruber/browser-run) and [tape-run](https://github.com/juliangruber/tape-run), with better Windows support and smaller footprint.

I love using browser-run/tape-run in my project to run unit test. But there are few things keep bothering me.

1. browser-launcher is out of maintain, it has some bad issue on Windows which nobody cares enough to fix.
2. [some issue](https://github.com/juliangruber/electron-stream/issues/28) on the way browser-run calls electron-stream.
2. the dependencies tree is bit too big to my taste. A flesh install of browser-run downloads 166MB node_modules.

browser-do offers

1. browser launcher implementation borrowed from various karma browser launchers. Simpler and more reliable on Windows.
2. keep dependencies small.
3. [TAP output](https://en.wikipedia.org/wiki/Test_Anything_Protocol) support in one package.

## Usage

TODO keep opts same as much as possible, add one option (or make it default) for TAP output.

