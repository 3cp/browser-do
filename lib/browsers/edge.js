/* eslint-disable no-console */
// https://github.com/jslegers/karma-edge-launcher/blob/master/index.js

const path = require('path');
const {exec} = require('child_process');

const backslashRegex = /\\/g;
const escapeBackslash = '\\\\';
const spaceRegex = / /g;
const escapeSpace = '` ';
const startScriptPath = path
  .join(__dirname, 'start_edge.ps1')
  .replace(backslashRegex, escapeBackslash)
  .replace(spaceRegex, escapeSpace);

function killEdgeProcess() {
  exec('taskkill /t /f /im MicrosoftEdge.exe', function (err) {
    if (err) {
      console.error('Killing Edge process failed. ' + err);
    } else {
      console.debug('Killed Edge process');
    }
  });
}

module.exports = {
  path: {
    win32: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
  },
  args: [
    startScriptPath
  ],
  onExit: killEdgeProcess
};
