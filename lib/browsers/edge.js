const path = require('path');
const {spawn} = require('child_process');

const escapeRegex = /\\/g;
const escapement = '\\\\';
const startScriptPath = path.join(__dirname, 'scripts/start_edge.ps1').replace(escapeRegex, escapement);
const stopScriptPath = path.join(__dirname, 'scripts/stop_edge.ps1').replace(escapeRegex, escapement);

module.exports = {
  path: {
    win32: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
  },
  args: [
    startScriptPath
  ]
};
