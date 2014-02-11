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

var subject = require('../../../lib/actions/player/random');

describe('player.random action', function() {

  it('sends the random command', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, { value: 1 });

    assert.ok(radio.sendCommands.calledWith([
      ['random', 1]
    ]));
  });

});

