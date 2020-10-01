/* global describe, it, expect, xdescribe */
describe('scope1', function() {
  it('test1', function() {
    expect(1).toBe(1);
  });
});

xdescribe('scope2', function() {
  it('test2', function(done) {
    setTimeout(function() {
      expect(2).toBe(1);
      done();
    }, 200);
  });
});
