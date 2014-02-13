/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon'),
    EventEmitter = require('events').EventEmitter;

var utils = require('radiodan-client').utils;

chai.use(chaiAsPromised);

var subject = require('../../../lib/actions/player/seek');

describe('player.seek action', function() {
  it('sends the seek current command with seek time', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {time: -43});

    assert.ok(radio.sendCommands.calledWith([
      ['seekcur', -43]
    ]));
  });

  it('sends the seek command with position and seek time', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {position: 2, time: 33});

    assert.ok(radio.sendCommands.calledWith([
      ['seek', 2, 33]
    ]));
  });
});

