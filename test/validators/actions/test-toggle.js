'use strict';

var subject = require(libDir + 'validators/actions/toggle');

describe('validate toggle action', function() {
  it('rejects if value not supplied', function(done) {
    var promise = subject({});

    assert.isRejected(promise, Error)
          .notify(done);
  });

  it('casts true value to 1', function(done) {
    var promise = subject({ value: true });

    assert.becomes(promise, { value: 1 })
          .notify(done);
  });

  it('casts false value to 0', function(done) {
    var promise = subject({ value: false });

    assert.becomes(promise, { value: 0 })
          .notify(done);
  });

  it('rejects if value not a boolean', function(done){
    var promise = subject({ value: 'true' });
    assert.isRejected(promise, Error).notify(done);
  });
});

