'use strict';

var audio = require(libDir + 'system/audio');

describe('system audio', function(){
  describe('when volume is valid', function() {
    it('execs command for osx', function(done) {
      var self = this,
          execSpy  = sinon.stub(),
          execMock = function(cmd) {
            execSpy(cmd);
            return utils.promise.resolve("71");
          };

      var setVolume = audio.create(
        'darwin', execMock
      ).setVolume({value: 71});

      setVolume.then(function(volume){
        assert.equal(1, execSpy.callCount);
        assert.equal(71, volume);
        assert.deepEqual(
          ["osascript -e 'set volume output volume 71'; osascript -e 'output volume of (get volume settings)'"],
          execSpy.firstCall.args);
      }).then(done, done);
    });

    it('execs command for linux', function(done){
      var self = this,
          execSpy  = sinon.stub(),
          execMock = function(cmd) {
            execSpy(cmd);
            return utils.promise.resolve("71");
          };

      var setVolume = audio.create(
        'linux', execMock
      ).setVolume({value: 71});

      setVolume.then(function(volume){
        assert.equal(1, execSpy.callCount);
        assert.equal(71, volume);
        assert.deepEqual(
          ["amixer -M set $(amixer | grep -o -m 1 \"'[^']*'\" | tr -d \"'\") 71% unmute | grep -o -m 1 '[[:digit:]]*%' | tr -d '%'"],
          execSpy.firstCall.args);
      }).then(done, done);
    });

    it('execs nothing for unknown platforms', function(){
      var execMock = sinon.spy();

      assert.throw(function() {
        audio.create(
          'win32', execMock
        );
      });

      assert.equal(0, execMock.callCount);
    });
  });
});
