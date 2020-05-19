const test = require('tape');
const {PassThrough} = require('stream');
const tapParse = require('../lib/tap-parse');
const through = () => new PassThrough();

test('tapParse passes all ok', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.equal(err, null);
    t.true(passed);
    t.end();
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

test('tapParse passes all ok with plan at top', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.equal(err, null);
    t.true(passed);
    t.end();
  });

  [
    '1..2',
    'ok',
    'ok',
    '# tests 2',
    '# pass  2'
  ].forEach(l => inp.write(l + '\r\n'));
});

test('tapParse fails the fail', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.equal(err, null);
    t.false(passed);
    t.end();
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

test('tapParse fails the fail with plan on top', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.equal(err, null);
    t.false(passed);
    t.end();
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

test('tapParse never finish with no plan', t => {
  const inp = through();

  const rl = tapParse(inp, () => {
    t.fail('should not reach here');
    t.end();
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
    t.pass('never calls cb');
    t.end();
  });
});

test('tapParse ignore fails on todo', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.equal(err, null);
    t.true(passed);
    t.end();
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

test('tapParse ignore fails on skip', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.equal(err, null);
    t.true(passed);
    t.end();
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

test('tapParse throws error on Bail out!', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.equal(err.message, 'Bail out! lorem');
    t.equal(passed, undefined);
    t.end();
  });

  [
    '1..10',
    'ok 1',
    'ok 2',
    'Bail out! lorem',
    'bla bla'
  ].forEach(l => inp.write(l + '\n'));
});

test('tapParse throws error on unsupported TAP version!', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.equal(err.message, 'TAP version 14 is not supported');
    t.equal(passed, undefined);
    t.end();
  });

  [
    'TAP version 14',
    '1..2',
    'ok 1',
    'ok 2',
  ].forEach(l => inp.write(l + '\n'));
});
