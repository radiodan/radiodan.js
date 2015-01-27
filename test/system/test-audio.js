var audio = require(libDir + 'system/audio');

describe('system audio', function(){
  describe('when volume is valid', function() {
    beforeEach(function(){
      var execPromise = utils.promise.defer();

      this.msgMock = new EventEmitter();
      this.msgMock.createAndBindToExchange = sinon.spy();
      this.execPromise = execPromise;
    });

    it('execs command for osx', function(done) {
      var self = this,
          data = { ack: sinon.spy(), content: { action: "volume", value: 71 }};

      var execSpy = sinon.stub();

      self.execMock = function(cmd) {
        var stdout = execSpy(cmd);
        self.execPromise.resolve(stdout);
        return self.execPromise.promise;
      };

      audio.create('test-device').listen(
        self.msgMock, 'darwin', self.execMock
      );

      self.msgMock.emit('command.audio.test-device', data);

      assert.isFulfilled(self.execPromise.promise).then(function(){
        assert.equal(1, data.ack.callCount);
        assert.equal(1, execSpy.callCount);
        assert.deepEqual(
          ["osascript -e 'set volume output volume 71'; osascript -e 'output volume of (get volume settings)'"],
          execSpy.firstCall.args);
      }).then(done, done);
    });

    it('execs command for linux', function(done){
      var self = this,
          data = { ack: sinon.spy(), content: { action: "volume", value: 71 }};

      var execSpy = sinon.stub();

      self.execMock = function(cmd) {
        var stdout = execSpy(cmd);
        self.execPromise.resolve(stdout);
        return self.execPromise.promise;
      };

      audio.create('test-device').listen(
        self.msgMock, 'linux', self.execMock
      );

      self.msgMock.emit('command.audio.test-device', data);

      assert.isFulfilled(self.execPromise.promise).then(function(){
        assert.deepEqual(
          ["amixer -M set $(amixer | grep -o -m 1 \"'[^']*'\" | tr -d \"'\") 71% unmute | grep -o -m 1 '[[:digit:]]*%' | tr -d '%'"],
          execSpy.firstCall.args);
      }).then(done, done);
    });

    it('execs nothing for unknown platforms', function(){
      var self = this,
          data = { ack: sinon.spy(), content: { value: 32 }};

      self.execMock = sinon.spy();

      audio.create('test-device').listen(
        self.msgMock, 'win32', self.execMock
      );

      self.msgMock.emit('command.audio.test-device', data);

      assert.equal(0, self.execMock.callCount);
    });

    it('execs nothing for unknown event emission', function(){
      var self = this;
      self.execMock = sinon.spy();

      audio.create('test-device').listen(self.msgMock, 'darwin', self.execMock);

      self.msgMock.emit('command.radio.volume', 88);

      assert.equal(0, self.execMock.callCount);
    });
  });
});
