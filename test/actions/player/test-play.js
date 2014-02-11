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

var subject = require('../../../lib/actions/player/play');

describe('player.play action', function() {

  it('sends the play command', function() {
    var radio = { sendCommands: sinon.spy() };

    var volumePromise = subject(radio, {});

    assert.ok(radio.sendCommands.calledWith([
      ['play']
    ]));
  });

  it('sends position if specified', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {position: 10});

    assert.ok(radio.sendCommands.calledWith([
        ['play', 10]
    ]));
  });
});

