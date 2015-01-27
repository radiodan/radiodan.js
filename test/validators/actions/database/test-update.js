'use strict';

var subject = require(libDir + 'validators/actions/database/update');

describe('validate database action', function() {
  it('resolves with force defaulted to false', function(done) {
    var promise = subject({});
    assert.becomes(promise, { force: false }).notify(done);
  });

  it('resolves with defaults', function(done) {
    var promise = subject({ path: 'a/path' });
    assert.becomes(promise, { path: 'a/path', force: false }).notify(done);
  });

  it('resolves with explicit values', function(done) {
    var promise = subject({force: true, path: 'some/path', something: 'else' });
    assert.becomes(promise, { force: true, path: 'some/path' }).notify(done);
  });

  it('rejects if force not boolean', function(done) {
    var promise = subject({force: 'true' });
    assert.isRejected(promise, Error).notify(done);
  });

  it('rejects if path not string', function(done) {
    var promise = subject({ path: ['wrong/path'] });
    assert.isRejected(promise, Error).notify(done);
  });
});

