var lines = `
not ok
ok
not ok
ok
ok
ok
1..6
`.split(/\r|\r\n|\n/);

var iv = setInterval(function () {
  if (lines.length === 0) {
    clearInterval(iv);
  }

  var line = lines.shift();
  if (line) console.log(line);
}, 25);