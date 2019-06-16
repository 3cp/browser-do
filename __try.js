var lines = `1..2

ok 1 some demo1

ok 2 some demo2

# tests 2

# pass 2

# fail 0
`.split(/\r|\r\n|\n/);

var iv = setInterval(function () {
  if (lines.length === 0) {
    clearInterval(iv);
  }

  var line = lines.shift();
  if (line) console.log(line);
}, 25);