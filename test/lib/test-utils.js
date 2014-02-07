/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon'),
    winston = require('winston');

var utils = require('radiodan-client').utils;

chai.use(chaiAsPromised);

var subject = require('radiodan-client').utils;

describe('utils', function (){
  before(function() {
    // chill winston
    winston.remove(winston.transports.Console);
  });

  after(function() {
    winston.add(winston.transports.Console);
  });

  describe('#failedPromiseHandler', function() {
    it('writes the error to a log', function(done) {
      var mockError = {error: sinon.spy()},
          handler = subject.failedPromiseHandler(mockError),
          promise = handler('Failed');

      assert.isRejected(promise).then(function() {
        assert.ok(mockError.error.calledWith('Failed'));
        done();
      });
    });

    it('returns a rejected promise', function(done){
      var mockError = {error: function(){}},
          handler = subject.failedPromiseHandler(mockError),
          promise = handler('Failed');

      assert.isRejected(promise).notify(done);
    });
  });

  describe('#uuid', function() {
    it('creates unique identifiers', function() {
      var id1 = subject.uuid(),
          id2 = subject.uuid(),
          id3 = subject.uuid();

      assert.ok(id1 != id2);
      assert.ok(id1 != id3);
      assert.ok(id2 != id3);
    });
  });

  describe('#logger', function() {
    it('set a default log level of warn', function() {
      var logger = subject.logger(__filename);
      assert.equal('warn', logger.level);
    });

    it('sets a log level for subsequent loggers', function() {
      subject.logger.setLevel('debug');
      var logger = subject.logger(__filename);

      assert.equal('debug', logger.level);
    });

    it('sets the current filename as a label', function() {
      var logger = subject.logger('filename.js');

      assert.equal('filename', logger.transports.console.label);
    });
  });
});
