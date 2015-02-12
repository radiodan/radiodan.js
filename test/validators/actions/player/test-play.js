'use strict';

var subject = require(libDir + 'validators/actions/player/play');

describe('validate player.play action', function() {
  it('resolves with correct options', function(done) {
    var promise = subject({});

    assert.becomes(promise, {})
          .notify(done);
  });

  it('resolves with position', function(done) {
    var promise = subject({ position: 11 });

    assert.becomes(promise, { position: 11 })
          .notify(done);
  });

  it('parses position to integer', function(done) {
    var promise = subject({ position: "12" });

    assert.becomes(promise, { position: 12 })
          .notify(done);
  });

  it('rejects if position is not a number', function(done){
    var promise = subject({ position: {} });
    assert.isRejected(promise, Error).then(done, done);
  });
});

