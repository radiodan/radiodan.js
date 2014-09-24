var subject = require(libDir + 'validators/actions/player/volume');

describe('volume validator', function() {
  it('accepts an absolute value', function(done) {
    var volumePromise = subject({value: 31});
    assert.becomes(volumePromise, { value: 31 }).notify(done);
  });

  it('accepts a differential value', function(done) {
    var volumePromise = subject({diff: -10});
    assert.becomes(volumePromise, { diff: -10 }).notify(done);
  });

  it('rejects unknown volume action types', function(done) {
    var volumePromise = subject({blah: 31});
    assert.isRejected(volumePromise, Error).notify(done);
  });

  it('rejects absolute values outside of range', function(done) {
    var overPromise = subject({value: 101});
    var underPromise = subject({value: -1});

    assert.isRejected(overPromise, Error)
          .then(function () {
            return assert.isRejected(underPromise, Error).notify(done);
          });
  });

  it('rejects non-integer differential values', function(done) {
    var volumePromise = subject({diff: "yes"});
    assert.isRejected(volumePromise, Error).notify(done);
  });

  it('rejects combined absolute and differential values', function(done) {
    var volumePromise = subject({diff: -10, value: 99});
    assert.isRejected(volumePromise, Error).notify(done);
  });
});
