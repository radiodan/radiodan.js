/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

var Q = require('Q');

chai.use(chaiAsPromised);

var subject = require('../lib/mpd-child-process');

describe('mpdProcess', function(){

  describe('locating the mpd binary', function () {
    it('uses which to locate binary', function () {
      var exec = sinon.stub().returns({ done: function () {} });
      subject.processPath(exec);
      assert(exec.calledWith('which mpd'), 'wrong command');
    });

    it('finds the first mpd binary on the system', function (done) {

      var exec = function () {
        var dfd = Q.defer(),
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
      var mock = sinon.spy(),
          binPath = this.binaryPath;

      subject.processPath = function () {
        var dfd = Q.defer();
        dfd.resolve(binPath);
        return dfd.promise;
      };

      var promise = subject.create('some/config.conf', mock);

      promise.then(function () {
        assert(mock.calledWithExactly(binPath, ['some/config.conf', '--no-daemon']));
        assert(promise.isFulfilled());
        done();
      });
    });

    it('rejects the promise on spawning error');
    it('rejects the promise if no mpd binary is found');
  });

  describe('logging output from the mpd process', function () {
    it('logs stdout from the child process');
    it('logs stderr from the child process');
  });

});
