const test = require('tape');

test('test1', function(t) {
  t.is(1, 1);
  t.end();
});

test('test2', function(t) {
  setTimeout(function() {
    t.is(2, 1);
    t.end();
  }, 200);
});
