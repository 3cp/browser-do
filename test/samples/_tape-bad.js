const test = require('tape');

test('test1', function(t) {
  t.equal(1, 1);
  t.end();
});

test('test2', function(t) {
  setTimeout(function() {
    t.equal(2, 1);
    t.end();
  }, 200);
});
