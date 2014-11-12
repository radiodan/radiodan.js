var subject = require(libDir + 'utils/bound-volume');

describe('boundVolume', function(){
  describe('absolute values', function () {
    it('clamps to 0 if less than 0', function() {
      assert.equal(subject(-10000000), 0);
    });
    it('clamps to 100 if more than 100', function() {
      assert.equal(subject(10000000), 100);
    });
    it('accepts value between bounds', function() {
      assert.equal(subject(67), 67);
    });
  });
  describe('diff values', function () {
    it('clamps to 0 if less than 0', function() {
      assert.equal(subject(10, -1000), 0);
    });
    it('clamps to 100 if more than 100', function() {
      assert.equal(subject(99, 2), 100);
    });
    it('accepts value between bounds', function() {
      assert.equal(subject(67, -50), 17);
    });
  });
});