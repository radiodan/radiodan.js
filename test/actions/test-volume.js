/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon'),
    winston = require('winston'),
    fs     = require('fs'),
    EventEmitter = require('events').EventEmitter;

var utils = require('radiodan-client').utils;

chai.use(chaiAsPromised);

var subject = require('../../lib/actions/volume');

describe('volume action', function() {
  before(function() {
    // chill winston
    winston.remove(winston.transports.Console);
  });

  after(function() {
    winston.add(winston.transports.Console);
  });

  it('rejects unknown volume action types without sending commands', function(done) {
    var radio = { sendCommands: sinon.spy() };

    var volumePromise = subject(radio, {blah: 31});

    assert.isRejected(volumePromise, Error, "Volume Command not found").then(function() {
      assert.equal(0, radio.sendCommands.callCount);
      done();
    });
  });

  it('sends percentage value to mpd', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {value: 30});

    assert.ok(radio.sendCommands.calledWith([
        ['setvol', 30]
    ]));
  });

  it('bounds percentage high values to 100', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {value: 999999});

    assert.ok(radio.sendCommands.calledWith([
        ['setvol', 100]
    ]));
  });

  it('bounds percentage low values to 0', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {value: -999999});

    assert.ok(radio.sendCommands.calledWith([
        ['setvol', 0]
    ]));
  });

  it('calculates differential value and sends to mpd', function(done) {
    var radio = { sendCommands: sinon.spy() };

    var promiseStatus = utils.promise.defer();
    radio.status = function() {
      promiseStatus.resolve({volume: "100"});
      return promiseStatus.promise;
    };

    subject(radio, {diff: -30});

    assert.isFulfilled(promiseStatus.promise).then(function() {
      assert.ok(radio.sendCommands.calledWith([
          ['setvol', 70]
      ]));

      done();
    });
  });

  it('bounds differential values to percentages', function(done) {
    var radio = { sendCommands: sinon.spy() };

    var promiseStatus = utils.promise.defer();
    radio.status = function() {
      promiseStatus.resolve({volume: "30"});
      return promiseStatus.promise;
    };

    subject(radio, {diff: -40});

    assert.isFulfilled(promiseStatus.promise).then(function() {
      assert.ok(radio.sendCommands.calledWith([
          ['setvol', 0]
      ]));

      done();
    });
  });
});

