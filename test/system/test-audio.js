var audio = require(libDir + 'system/audio');

describe('system audio', function(){
  before(function() {
    // chill winston
    winston.remove(winston.transports.Console);
  });

  after(function() {
    winston.add(winston.transports.Console);
  });

  describe('when volume is valid', function() {
    beforeEach(function(){
      var execPromise = utils.promise.defer();

      this.msgMock = new EventEmitter;
      this.msgMock.createAndBindToExchange = sinon.spy();
      this.execPromise = execPromise;
    });

    it('execs command for osx', function(done) {
      var self = this,
          data = { ack: sinon.spy(), content: { action: "volume", value: 71 }};

      var execSpy = sinon.stub();
      execSpy.onCall(0).returns(1);
      execSpy.onCall(1).returns(2);
      execSpy.onCall(2).returns(3);

      self.execMock = function(cmd) {
        var stdout = execSpy(cmd);
        if(stdout === 3) {
          self.execPromise.resolve(stdout);
          return self.execPromise.promise;
        } else {
          return utils.promise.resolve(stdout);
        }
      };

      audio.create('test-device').listen(
        self.msgMock, 'darwin', self.execMock, winston
      );

      self.msgMock.emit('command.audio.test-device', data);

      assert.isFulfilled(self.execPromise.promise).then(function(){
        assert.equal(1, data.ack.callCount);
        assert.equal(3, execSpy.callCount);
        assert.deepEqual(
          ["osascript -e 'output volume of (get volume settings)'"],
          execSpy.firstCall.args);
        assert.deepEqual(
          ["osascript -e 'set volume output volume 71'"],
          execSpy.secondCall.args);
        assert.deepEqual(
          ["osascript -e 'output volume of (get volume settings)'"],
          execSpy.firstCall.args);
      }).then(done, done);
    });

    it('execs command for linux', function(done){
      var self = this,
          data = { ack: sinon.spy(), content: { action: "volume", value: 88 }};

      self.msgMock.emit('command.audio.test-device', data);

      var execSpy = sinon.stub();
      execSpy.onCall(0).returns(1);
      execSpy.onCall(1).returns(2);
      execSpy.onCall(2).returns(3);

      self.execMock = function(cmd) {
        var stdout = execSpy(cmd);
        if(stdout === 3) {
          self.execPromise.resolve(stdout);
          return self.execPromise.promise;
        } else {
          return utils.promise.resolve(stdout);
        }
      };

      audio.create('test-device').listen(self.msgMock, 'linux', self.execMock, winston);

      self.msgMock.emit('command.audio.test-device', data);

      assert.isFulfilled(self.execPromise.promise).then(function(){
        assert.equal(3, execSpy.callCount);
        assert.deepEqual(
          ["amixer -M sget $(amixer | grep -o -m 1 \"'[^']*'\" | tr -d \"'\") | grep -o -m 1 '[[:digit:]]*%' | tr -d '%'"],
          execSpy.firstCall.args);
        assert.deepEqual(
          ["amixer -M set $(amixer | grep -o -m 1 \"'[^']*'\" | tr -d \"'\") 88% unmute"],
          execSpy.secondCall.args);
        assert.deepEqual(
          ["amixer -M sget $(amixer | grep -o -m 1 \"'[^']*'\" | tr -d \"'\") | grep -o -m 1 '[[:digit:]]*%' | tr -d '%'"],
          execSpy.firstCall.args);
      }).then(done, done);
    });

    it('execs nothing for unknown platforms', function(done){
      var self = this,
          data = { ack: sinon.spy(), content: { value: 32 }};

      self.execMock = sinon.spy();

      audio.create('test-device').listen(
        self.msgMock, 'win32', self.execMock, winston
      );

      self.msgMock.emit('command.audio.test-device', data);

      assert.equal(0, self.execMock.callCount);
      done();
    });

    it('execs nothing for unknown event emission', function(done){
      var self = this;
      self.execMock = sinon.spy();

      audio.create('test-device').listen(self.msgMock, 'darwin', self.execMock);

      self.msgMock.emit('command.radio.volume', 88);

      assert.equal(0, self.execMock.callCount);
      done();
    });
  });
});
