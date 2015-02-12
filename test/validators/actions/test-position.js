'use strict';

var subject = require(libDir + 'validators/actions/position');

describe('validate position action', function() {
  it('accepts an absolute position', function(done) {
    var promise = subject({ position: 2 });

    assert.becomes(promise, { value: 2 })
          .notify(done);
  });

  it('accepts a range of values', function(done) {
    var promise = subject({ start: 1, end: 3 });

    assert.becomes(promise, { value: '1:3' })
          .notify(done);
  });

  it('rejects if range and position are both set', function(done){
    var promise = subject({ position: 1, start: 1, end: 2 });
    assert.isRejected(promise, Error).notify(done);
  });

  it('rejects if range is in wrong order', function(done){
    var promise = subject({ start: 9, end: 2 });
    assert.isRejected(promise, Error).notify(done);
  });
});

