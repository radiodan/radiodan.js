var subject = require(libDir + 'states/database-update');

describe('database update state', function() {
  it('emits start state', function(done) {
    assert.isFulfilled(subject.start(sinon.stub()))
      .then(function(status) {
        assert.deepEqual(
          {},
          status
        );
      })
      .then(done, done);
  });

  it('emits end state', function(done) {
    assert.isFulfilled(subject.end(sinon.stub()))
      .then(function(status) {
        assert.deepEqual(
          {},
          status
        );
      })
      .then(done, done);
  });
});
