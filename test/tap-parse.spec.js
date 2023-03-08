const test = require('tape');
const {PassThrough} = require('stream');
const tapParse = require('../lib/tap-parse');

test('tapParse passes all ok', async t => {
  const inp = new PassThrough();

  return new Promise(resolve => {
    tapParse(inp, (err, passed) => {
      t.equal(err, null);
      t.ok(passed);
      resolve();
    });

    [
      'TAP version 13',
      '# wait',
      'ok 1 (unnamed assert)',
      'ok 2 should be equal',
      '1..2',
      '# tests 2',
      '# pass  2'
    ].forEach(l => inp.write(l + '\n'));
  });
});

test('tapParse passes all ok with plan at top', async t => {
  const inp = new PassThrough();

  return new Promise(resolve => {
    tapParse(inp, (err, passed) => {
      t.equal(err, null);
      t.ok(passed);
      resolve();
    });

    [
      '1..2',
      'ok',
      'ok',
      '# tests 2',
      '# pass  2'
    ].forEach(l => inp.write(l + '\r\n'));
  });
});

test('tapParse fails the fail', async t => {
  const inp = new PassThrough();

  return new Promise(resolve => {
    tapParse(inp, (err, passed) => {
      t.equal(err, null);
      t.notOk(passed);
      resolve();
    });

    [
      'TAP version 13',
      '# wait',
      'ok 1 (unnamed assert)',
      'not ok 2 should be equal',
      '  ---',
      '    operator: equal',
      '    expected: 5',
      '    actual:   4',
      '  ...',
      '',
      '1..2',
      '# tests 2',
      '# pass  1',
      '# fail  1'
    ].forEach(l => inp.write(l + '\n'));
  });
});

test('tapParse fails the fail with plan on top', async t => {
  const inp = new PassThrough();

  return new Promise(resolve => {
    tapParse(inp, (err, passed) => {
      t.equal(err, null);
      t.notOk(passed);
      resolve();
    });

    [
      'TAP version 13',
      '1..2',
      '# wait',
      'ok 1 (unnamed assert)',
      'not ok 2 should be equal',
      '  ---',
      '    operator: equal',
      '    expected: 5',
      '    actual:   4',
      '  ...',
      '',
      '# tests 2',
      '# pass  1',
      '# fail  1'
    ].forEach(l => inp.write(l + '\n'));
  });
});

test('tapParse never finish with no plan', async t => {
  const inp = new PassThrough();

  return new Promise(resolve => {
    const rl = tapParse(inp, () => {
      t.fail('should not reach here');
      resolve();
    });

    [
      'TAP version 13',
      'ok 1 (unnamed assert)',
      'not ok 2 should be equal',
      '  ---',
      '    operator: equal',
      '    expected: 5',
      '    actual:   4',
      '  ...',
      '',
      '# tests 2',
      '# pass  1',
      '# fail  1'
    ].forEach(l => inp.write(l + '\n'));

    setTimeout(() => {
      inp.end();
      rl.close();
      t.ok(true, 'never calls cb');
      resolve();
    });
  });
});

test('tapParse ignore fails on todo', async t => {
  const inp = new PassThrough();

  return new Promise(resolve => {
    tapParse(inp, (err, passed) => {
      t.equal(err, null);
      t.ok(passed);
      resolve();
    });

    [
      'TAP version 13',
      'ok 1 (unnamed assert)',
      'not ok 2 should be equal # TODO to fix',
      '  ---',
      '    operator: equal',
      '    expected: 5',
      '    actual:   4',
      '  ...',
      '',
      '1..2',
      '# tests 2',
      '# pass  1',
      '# fail  1'
    ].forEach(l => inp.write(l + '\n'));
  });
});

test('tapParse ignore fails on skip', async t => {
  const inp = new PassThrough();

  return new Promise(resolve => {
    tapParse(inp, (err, passed) => {
      t.equal(err, null);
      t.ok(passed);
      resolve();
    });

    [
      'TAP version 13',
      '1..2',
      'ok 1 (unnamed assert)',
      'not ok 2 should be equal # skipped due to bla',
      '  ---',
      '    operator: equal',
      '    expected: 5',
      '    actual:   4',
      '  ...',
      '',
      '# tests 2',
      '# pass  1',
      '# fail  1'
    ].forEach(l => inp.write(l + '\n'));
  });
});

test('tapParse throws error on Bail out!', async t => {
  const inp = new PassThrough();

  return new Promise(resolve => {
    tapParse(inp, (err, passed) => {
      t.equal(err.message, 'Bail out! lorem');
      t.equal(passed, undefined);
      resolve();
    });

    [
      '1..10',
      'ok 1',
      'ok 2',
      'Bail out! lorem',
      'bla bla'
    ].forEach(l => inp.write(l + '\n'));
  });
});

test('tapParse throws error on unsupported TAP version!', async t => {
  const inp = new PassThrough();

  return new Promise(resolve => {
    tapParse(inp, (err, passed) => {
      t.equal(err.message, 'TAP version 14 is not supported');
      t.equal(passed, undefined);
      resolve();
    });

    [
      'TAP version 14',
      '1..2',
      'ok 1',
      'ok 2',
    ].forEach(l => inp.write(l + '\n'));
  });
});
