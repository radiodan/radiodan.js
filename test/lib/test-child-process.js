var subject = require(libDir + 'child-process');

describe('Child Process', function(){
  beforeEach(function() {
    // stub out process to prevent attempted removal of child process
    process.on = sinon.stub();
  });

  describe('locating full path of command', function () {
    it('uses POSIX commands to locate path', function () {
      var exec = sinon.stub().returns(utils.promise.resolve(''));

      subject.processPath('mopidy', exec);
      assert(exec.calledWith('command -v mopidy'), 'wrong command called');
    });

    it('returns the first path if multiple matches are found', function (done) {
      var exec = sinon.stub().returns(
            utils.promise.resolve(
              ['/first/path/to/mpd', '/second/path/to/mpd']
            )
          ),
          processPromise = subject.processPath('mpd', exec);

      assert.becomes(
        processPromise, '/first/path/to/mpd'
      ).then(done, done);
    });
  });

  describe('spawning the process', function () {
    it('rejects on error', function(done) {
      var spawnMock = sinon.stub();

      subject.processPath = function () {
        return utils.promise.resolve('cmd');
      };

      spawnMock.returns({
        stdout: {on: function(){}},
        stderr: {on: function(){}},
        on: function(eventName,cb){
          if(eventName === 'error') {
            cb();
          }
        }
      });

      var promise = subject.spawnProcess('cmd', ['args'], spawnMock);

      assert.isRejected(promise)
        .then(function () {
          assert(spawnMock.calledWithExactly('cmd', ['args']), 'called with unexpected arguments');
        })
        .then(done, done);
    });

    it('rejects the promise if no mpd binary is found', function(done) {
      var spawnMock = sinon.stub(),
          binPath = this.binaryPath;

      subject.processPath = function () {
        var dfd = utils.promise.defer();
        dfd.reject('');
        return dfd.promise;
      };

      var promise = subject.create('some/config.conf', spawnMock);

      assert.isRejected(promise)
        .then(function () {
          assert.equal(0, spawnMock.callCount);
        })
        .then(done, done);
    });

    it('logs stdout from the child process', function (done) {
      var spawnMock = sinon.stub(),
          loggerMock = {};

      loggerMock.debug = sinon.stub();

      spawnMock.returns({
        stdout: {on: function(eventName,cb){
          if(eventName === 'data') {
            cb('LOG ME');
          }
        }},
        on: function(){},
        stderr: {on: function(){}},
      });

      var promise = subject.spawnProcess(
        'command', ['args'], spawnMock, loggerMock
      );

      assert.isFulfilled(promise)
        .then(function () {
          assert(loggerMock.debug.calledWith('LOG ME'));
        })
        .then(done,done);
    });

    it('logs stderr from the child process', function(done) {
      var spawnMock = sinon.stub(),
          loggerMock = {},
          spawnEvent = new EventEmitter();
          spawnEvent.stdout = new EventEmitter();
          spawnEvent.stderr = new EventEmitter();
          spawnEvent.debug = new EventEmitter();
          loggerMock.debug = sinon.stub();

      spawnMock.returns(spawnEvent);

      var spawnPromise = subject.spawnProcess(
        'cmd', ['args'], spawnMock, loggerMock
      );

      spawnEvent.stderr.emit('data', 'ERROR:');

      assert.isFulfilled(spawnPromise)
        .then(function () {
          assert(loggerMock.debug.calledOnce);
          assert(loggerMock.debug.calledWith('ERROR:'));
        })
        .then(done,done);
    });
  });
});
