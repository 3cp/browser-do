const path = require('path');
const {spawn} = require('child_process');

const escapeRegex = /\\/g;
const escapement = '\\\\';
const startScriptPath = path.join(__dirname, 'start_edge.ps1').replace(escapeRegex, escapement);
const stopScriptPath = path.join(__dirname, 'stop_edge.ps1').replace(escapeRegex, escapement);

const powerShell = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
module.exports = {
  path: {
    win32: powerShell
  },
  args: [
    startScriptPath
  ],
  onExit: (pid, code) => {
    if (code === 0) {
      spawn(powerShell, [stopScriptPath], {stdio: ['ignore', 'inherit', 'inherit']});
    }
  }
};
