const {execSync} = require('child_process');

module.exports = {
  path: {
    darwin: 'open'
  },
  args: [
    '-F', // Opens the application "fresh," that is, without restoring windows.
    '-W', // Causes open to wait until the applications it opens (or that were already open) have exited.
    '-n', // Open a new instance of the application(s) even if one is already running.
    '-g', // Do not bring the application to the foreground.
    // '-a', // Specifies the application to use for opening the file.
    // getDarwinBin('/Applications/Safari.app/Contents/MacOS/Safari')
    '-b', // Specifies the bundle identifier for the application to use when opening the file.
    'com.apple.Safari'
  ],
  onExit() {
    // kill the last Safari process, this is the best guess.
    execSync('pkill -nx Safari');
  }
};
