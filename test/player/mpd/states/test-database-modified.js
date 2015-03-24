var subject = require(libDir + '/player/mpd/states/database-modified');

describe('database state', function() {
  it('extracts useful status info', function(done) {
    var statusPromise = utils.promise.resolve(),
        radio = { sendCommands: sinon.stub().returns(statusPromise),
                  formatResponse: sinon.stub().returns(
                    { artists: 1000, songs: 1234, db_playtime:10, db_update:1 })
                };

    assert.isFulfilled(subject(radio))
      .then(function(status) {
        assert.deepEqual(
          { artists: 1000, tracks: 1234, duration: 10 }, status.totals
        );

        assert.equal(
          new Date('Thu Jan 01 1970 00:00:01 GMT+0000').getTime(),
          status.updatedAt.getTime()
        );
      })
      .then(done, done);
  });
});
