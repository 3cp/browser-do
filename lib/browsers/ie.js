/* eslint-disable no-console */
const getExe = require('../get-exe');
const {execSync} = require('child_process');

// Spawning iexplore.exe spawns two processes (IE does that). The way karma kills the
// browser process (hard kill) leaves the other process in memory.
//
// The second process is created using command-line args like this:
//   "C:\Program Files\Internet Explorer\iexplore.exe" SCODEF:2632 CREDAT:275457 /prefetch:2
// Where the SCODEF value is the pid of the 'original' process created by this launcher.
//
// This function kills any iexplore.exe process who's command line args match 'SCODEF:pid'.
// On IE11 this will kill the extra process. On older versions, no process will be found.
function killExtraIEProcess(pid) {
  var scodef = 'SCODEF:' + pid;

  // wmic.exe : http://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
  var wmic = 'wmic.exe Path win32_Process ' +
    'where "Name=\'iexplore.exe\' and ' +
    "CommandLine Like '%" + scodef + '%\'" call Terminate';

  try {
    execSync(wmic);
    console.debug('Killed extra IE process.');
  } catch (err) {
    console.error('Killing extra IE process failed. ' + err);
  }
}

module.exports = {
  path: {
    win32: getExe('\\Internet Explorer\\iexplore.exe')
  },
  onExit: killExtraIEProcess
};
