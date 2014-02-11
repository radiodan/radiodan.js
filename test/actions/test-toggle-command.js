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

var subject = require('../../lib/actions/toggle-command');

describe('toggle command meta-action', function() {

  it('sends the given command with a value', function() {
    var radio = { sendCommands: sinon.spy() };

    subject('mycommand')(radio, { value: 0 });

    assert.ok(radio.sendCommands.calledWith([
      ['mycommand', 0]
    ]));
  });

});

