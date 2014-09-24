var subject = require(libDir + '/validators/actions/playlist/move');

describe('validate move action', function() {
  it('resolves with absolute options', function(done) {
    var promise = subject({
      from: 3, to: 4
    });

    assert.becomes(promise, { from: 3, to: 4})
          .notify(done);
  });

  it('resolves with range', function(done) {
    var promise = subject({
      start: 1, end: 10, to: 20
    });

    assert.becomes(promise, { from: '1:10', to: 20})
          .notify(done);
  });

  it('rejects without start attribute', function(){
    var promise = subject({to: 10});

    assert.isRejected(promise, Error);
  });

  it('rejects without valid range', function(){
    var promise = subject({start: -1, end: -30, to: 10});

    assert.isRejected(promise, Error);
  });

  it('rejects without to attribute', function(){
    var promise = subject({start: 10});

    assert.isRejected(promise, Error);
  });
});
