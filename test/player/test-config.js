var subject = require('../../lib/player/config');

//TODO: split into MPD config, mopidy config, generic features
describe('mpdConfig', function (){
  beforeEach(function () {
    this.configObject = {
      music: '~/music',
      playlist: '~/music/playlists',
      db: '~/music/mpd.db',
      log: '/var/log/mpd.log',
      player: 'mpd'
    };
  });

  it('generates a config file populated by supplied object', function (done) {
    var portsPromise = utils.promise.resolve([6600, 6601]);
    var mpdConfig = subject.create(this.configObject, portsPromise);
    var built = mpdConfig.build();

    assert.isFulfilled(built).then(function(mpdContent) {
      // music
      assert.match(mpdContent,
        /^music_directory (\s+) "~\/music"$/m);
      // playlist
      assert.match(mpdContent,
        /^playlist_directory (\s+) "~\/music\/playlists"$/m);
      // db
      assert.match(mpdContent,
        /^db_file (\s+) "~\/music\/mpd\.db"$/m);
      // log
      assert.match(mpdContent,
        /^log_file (\s+) "\/var\/log\/mpd\.log"$/m);
    }).then(done,done);
  });

  it('assigns ports', function(done) {
    var firstConfig  = subject.create({player: 'mpd'}, utils.promise.resolve([6600])),
        secondConfig = subject.create({player: 'mpd'}, utils.promise.resolve([6601])),
        firstBuild   = firstConfig.build(),
        secondBuild  = secondConfig.build();

    assert.isFulfilled(firstBuild).then(function(mpdContent) {
      return assert.match(mpdContent, /^port (\s+) "6600"$/m);
    }).then(function(){
      return assert.isFulfilled(secondBuild).then(function(mpdContent) {
        assert.match(mpdContent, /^port (\s+) "6601"$/m);
      })
    }).then(done,done);
  });

  it('assigns HTTP port', function(done) {
    var config = this.configObject;
    config.httpStreaming = true;

    var mpdConfig = subject.create(config, utils.promise.resolve([null, 8000])),
        built = mpdConfig.build();

    assert.isFulfilled(built).then(function(mpdContent) {
      assert.match(mpdContent, /port (\s+) "8000"$/m);
    }).then(done,done);
  });

  it('sets audio output format', function(done) {
    var config = {player: 'mpd', osx: true, outputFormat: '44100:16:1'},
        mpdConfig = subject.create(config, utils.promise.resolve([])),
        built = mpdConfig.build();

    assert.isFulfilled(built).then(function(mpdContent) {
      assert.match(mpdContent, /format (\s+) "44100:16:1"$/m);
    }).then(done,done);
  });

  it('generates a platform-specific boolean key', function(done) {
    var config = this.configObject;
    config.osx = true;

    var mpdConfig = subject.create(config, utils.promise.resolve([]));
    var built = mpdConfig.build();

    assert.isFulfilled(built).then(function(mpdContent) {
      assert.match(mpdContent, /type\s* "osx"$/m);
    }).then(done,done);
  });

  it('writes config to a generated path', function (done) {
    var mpdConfig = subject.create(this.configObject, utils.promise.resolve([0,1])),
        promise = mpdConfig.write();

    assert.isFulfilled(promise).then(function (args) {
      var filePath = args[0];
      assert(fs.existsSync(filePath));
    }).then(done, done);
  });
});
