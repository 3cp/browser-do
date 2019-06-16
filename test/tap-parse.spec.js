import test from 'ava';
import tapParse from '../lib/tap-parse';
import through from 'through';

test.cb('tapParse passes all ok', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.is(err, null);
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

test.cb('tapParse passes all ok with plan at top', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.is(err, null);
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

test.cb('tapParse fails the fail', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.is(err, null);
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

test.cb('tapParse fails the fail with plan on top', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.is(err, null);
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

test.cb('tapParse never finish with no plan', t => {
  const inp = through();

  const rl = tapParse(inp, (err, passed) => {
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
  })
});

test.cb('tapParse ignore fails on todo', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.is(err, null);
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

test.cb('tapParse ignore fails on skip', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.is(err, null);
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

test.cb('tapParse throws error on Bail out!', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.is(err.message, 'Bail out! lorem');
    t.is(passed, undefined);
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

test.cb('tapParse throws error on unsupported TAP version!', t => {
  const inp = through();

  tapParse(inp, (err, passed) => {
    t.is(err.message, 'TAP version 14 is not supported');
    t.is(passed, undefined);
    t.end();
  });

  [
    'TAP version 14',
    '1..2',
    'ok 1',
    'ok 2',
  ].forEach(l => inp.write(l + '\n'));
});
