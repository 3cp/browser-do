/* global describe, it, expect, fit */
describe('scope1', function() {
  fit('test1', function() {
    expect(1).toBe(1);
  });
});

describe('scope2', function() {
  it('test2', function(done) {
    setTimeout(function() {
      expect(2).toBe(1);
      done();
    }, 200);
  });
});
