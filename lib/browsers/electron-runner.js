// When we run into an uncaught exception, fail hard
// DEV: Without this line, Karma can hang indefinitely
process.on('uncaughtException', function handleUncaughtException (err) {
  throw err;
});

// Load in our dependencies
var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var [userDataDir, url] = process.argv.slice(-2);

// When all windows are closed, exit out
app.on('window-all-closed', function handleWindowsClosed () {
  app.quit();
});

// Update `userData` before Electron loads
// DEV: This prevents cookies/localStorage from contaminating across apps
app.setPath('userData', userDataDir);

// When Electron is done loading, launch our applicaiton
app.on('ready', function() {
  // Create our browser window
  var browserWindow = new BrowserWindow({show: false});
  browserWindow.loadURL(url);
});
