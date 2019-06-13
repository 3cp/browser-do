/* eslint-disable no-console */
// https://github.com/jslegers/karma-edge-launcher/blob/master/index.js

const path = require('path');
const {execSync} = require('child_process');

const backslashRegex = /\\/g;
const escapeBackslash = '\\\\';
const spaceRegex = / /g;
const escapeSpace = '` ';
const startScriptPath = path
  .join(__dirname, 'start_edge.ps1')
  .replace(backslashRegex, escapeBackslash)
  .replace(spaceRegex, escapeSpace);

function killEdgeProcess() {
  try {
    execSync('taskkill /t /f /im MicrosoftEdge.exe');
    console.debug('Killed Edge process');
  } catch (err) {
    console.error('Killing Edge process failed. ' + err);
  }
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
