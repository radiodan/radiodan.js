var playerProcess = require( libDir + '/player/player-process');

describe('playerProcess', function() {
  beforeEach(function() {
    var createStub = sinon.stub().returns(utils.promise.resolve());

    this.mockChildProcess = { create: createStub };
  });

  it('creates a command for a MPD process', function(done){
    var mockChildProcess = this.mockChildProcess,
        subject;

    subject = playerProcess.create(
      'mpd', 'config.txt', mockChildProcess
    );

    assert.isFulfilled(subject).then(function() {
      assert.deepEqual(
        ['mpd', ['config.txt', '--no-daemon', '--verbose']],
        mockChildProcess.create.firstCall.args
      );
    }).then(done,done);
  });

  it('creates a command for a Mopidy process', function(done) {
    var mockChildProcess = this.mockChildProcess,
        subject;

    subject = playerProcess.create(
      'mopidy', 'config.txt', mockChildProcess
    );

    assert.isFulfilled(subject).then(function() {
      assert.deepEqual(
        ['mopidy', ['--config', 'config.txt']],
        mockChildProcess.create.firstCall.args
      );
    }).then(done,done);
  });

  it('creates a command for Mopidy with spotify enabled', function(done) {
    var mockChildProcess = this.mockChildProcess,
        subject;

    process.env.SPOTIFY_USER = 'spotifyUser';
    process.env.SPOTIFY_PASS = 'spotifyPass';

    subject = playerProcess.create(
      'mopidy', 'config.txt', mockChildProcess
    );

    assert.isFulfilled(subject).then(function() {
      assert.deepEqual(
        ['mopidy', [
          '-o', 'spotify/username=spotifyUser',
          '-o', 'spotify/password=spotifyPass',
          '--config', 'config.txt',
        ]],
        mockChildProcess.create.firstCall.args
      );
    }).then(function() {
      //clean up environment variables
      delete(process.env.SPOTIFY_USER);
      delete(process.env.SPOTIFY_PASS);
    }).then(done,done);
  });

  it('rejects any of other kind of process', function(done) {
    var subject = playerProcess.create('rm -rf', '/');

    assert.isRejected(subject).notify(done);
  });
});
