/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

chai.use(chaiAsPromised);

var subject = require('../../../../lib/validators/actions/player/seek');

describe('validate player.seek action', function() {
  it('resolves with position and seek time', function(done) {
    var promise = subject({ position: 11, time: 31 });

    assert.becomes(promise, { position: 11, time: 31 })
          .notify(done);
  });

  it('resolves with seek time', function(done) {
    var promise = subject({ time: 31 });

    assert.becomes(promise, { time: 31 })
          .notify(done);
  });

  it('resolves with negative seek time if there is no position',
    function(done) {
    var promise = subject({ time: -31 });

    assert.becomes(promise, { time: -31 })
          .notify(done);
  });

  it('parses position and time to integer', function(done) {
    var promise = subject({ position: "12", time: "32" });

    assert.becomes(promise, { position: 12, time: 32 })
          .notify(done);
  });

  it('rejects with negative seek time if position is set', function(done) {
    var promise = subject({ time: -31, position: 12 });

    assert.isRejected(promise, Error).then(done, done);
  });

  it('rejects if position is not a number', function(done){
    var promise = subject({ position: {}, time: 31 });
    assert.isRejected(promise, Error).then(done, done);
;
  });

  it('rejects if time is not a number', function(done){
    var promise = subject({ position: 41, time: false });
    assert.isRejected(promise, Error).then(done, done);
  });
});

