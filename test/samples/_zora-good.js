const {test} = require('zora');

test('test1', function(t) {
  t.equal(1, 1);
});

test('test2', async function(t) {
  return new Promise(resolve => {
    setTimeout(function() {
      t.equal(2, 2);
      resolve();
    }, 200);
  });
});
