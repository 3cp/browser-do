var lines = 'not ok\n\
ok\n\
not ok\n\
ok\n\
ok\n\
ok\n\
1..6\n\
'.split(/\r|\r\n|\n/);

var iv = setInterval(function () {
  if (lines.length === 0) {
    clearInterval(iv);
  }

  var line = lines.shift();
  if (line) console.log(line);
}, 25);