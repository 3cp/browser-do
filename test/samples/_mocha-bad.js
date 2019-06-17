/* global describe, it */
const {expect} = require('chai');

describe('scope1', function() {
  it('test1', function() {
    expect(1).to.equal(1);
  });
});

describe('scope2', function() {
  it('test2', function(done) {
    setTimeout(function() {
      expect(2).to.equal(1);
      done();
    }, 200);
  });
});
