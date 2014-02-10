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

var subject = require('../../lib/actions/random');

describe('random action', function() {
  it('sends commands to mpd', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {directory: 'podcasts'});

    assert(radio.sendCommands.calledWith([
      ['clear'], ['add', 'podcasts'], ['random', '1'], ['play']
    ]));
  });
});

