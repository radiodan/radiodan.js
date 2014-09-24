var subject = require(libDir + '/validators/actions/playlist/add');

describe('validate play action', function() {
  it('resolves with correct options', function(done) {
    var promise = subject({
      playlist: ['track.mp3']
    });

    assert.becomes(promise, { playlist: ['track.mp3'], clear: false })
          .notify(done);
  });

  it('wraps a single playlist item in an array', function(done) {
    var promise = subject({
      playlist: 'track.mp3'
    });

    assert.becomes(promise, { playlist: ['track.mp3'], clear: false })
          .notify(done);
  });

  it('rejects if playlist is not empty', function(){
    var promise = subject({playlist: []});
    assert.isRejected(promise, Error);
  });
});
