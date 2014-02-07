/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon'),
    EventEmitter = require('events').EventEmitter;

var utils = require('radiodan-client').utils;

chai.use(chaiAsPromised);

var subject = require('../../lib/mpd-child-process');


function createMockLogger() {
  var logger = sinon.spy();
  logger.debug  = sinon.spy();
  logger.warn  = sinon.spy();
  logger.error = sinon.spy();
  return logger;
}

describe('mpdProcess', function(){
  describe('locating the mpd binary', function () {
    it('uses POSIX commands to locate binary', function () {
      var exec = sinon.stub().returns({ done: function () {} });
      subject.processPath(exec);
      assert(exec.calledWith('command -v mpd'), 'wrong command');
    });

    it('finds the first mpd binary on the system', function (done) {
      var exec = function () {
        var dfd = utils.promise.defer(),
            promise = dfd.promise;

        dfd.resolve(['/sommat/sommert/mpd']);
        return promise;
      };

      subject.processPath(exec);

      assert.becomes(subject.processPath(exec), '/sommat/sommert/mpd')
            .notify(done);
    });
  });

  describe('spawning a child mpd process', function () {

    before(function () {
      this.binaryPath = '/sommat/mpd';
    });


    it('spawns using the correct binary', function (done) {
      var spawnMock = sinon.stub(),
          loggerMock = createMockLogger(),
          binPath = this.binaryPath;

      subject.processPath = function () {
        var dfd = utils.promise.defer();
        dfd.resolve(binPath);
        return dfd.promise;
      };

      spawnMock.returns({stdout: {on: function(_,cb){ cb(''); }}});

      var promise = subject.create('some/config.conf', spawnMock, loggerMock);

      assert.isFulfilled(promise).then(function () {
        assert(spawnMock.calledWithExactly(binPath, ['some/config.conf', '--no-daemon', '--verbose']));
        done();
      });
    });

    it('rejects the promise on spawning error', function(done) {
      var spawnMock = sinon.stub(),
          loggerMock = createMockLogger(),
          binPath = this.binaryPath;

      subject.processPath = function () {
        var dfd = utils.promise.defer();
        dfd.resolve(binPath);
        return dfd.promise;
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

      var promise = subject.create('some/config.conf', spawnMock, loggerMock);

      assert.isRejected(promise).then(function () {
        assert(spawnMock.calledWithExactly(binPath, ['some/config.conf', '--no-daemon', '--verbose']));
        done();
      });
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

      assert.isRejected(promise).then(function () {
        assert.equal(0, spawnMock.callCount);
        done();
      });
    });
  });

  describe('logging output from the mpd process', function () {
    it('logs stdout from the child process', function (done) {
      var spawnMock = sinon.stub(),
          loggerMock = createMockLogger(),
          binPath = this.binaryPath;

      subject.processPath = function () {
        var dfd = utils.promise.defer();
        dfd.resolve();
        return dfd.promise;
      };

      spawnMock.returns({
        stdout: {on: function(eventName,cb){
          if(eventName === 'data') {
            cb('');
          }
        }},
        on: function(){},
        stderr: {on: function(){}},
      });

      var promise = subject.create(
          'some/config.conf',
          spawnMock, loggerMock);

      assert.isFulfilled(promise).then(function () {
        assert(loggerMock.debug.calledOnce);
        done();
      });
    });

    it('logs stderr from the child process', function(done) {
      var spawnMock = sinon.stub(),
          loggerMock = createMockLogger(),
          binPath = this.binaryPath;

      var processPromise = utils.promise.defer();
      subject.processPath = function () {
        processPromise.resolve();
        return processPromise.promise;
      };

      var spawnEvent = new EventEmitter();
      spawnEvent.stdout = new EventEmitter();
      spawnEvent.stderr = new EventEmitter();

      spawnMock.returns(spawnEvent);

      var promise = subject.create(
        'some/config.conf',
        spawnMock, loggerMock
        );

      // wait for spawn promise to complete...
      processPromise.promise.then(function(){
        spawnEvent.stderr.emit('data', '');
      });

      assert.isFulfilled(promise).then(function () {
        assert(loggerMock.debug.calledOnce);
        done();
      });
    });
  });
});
