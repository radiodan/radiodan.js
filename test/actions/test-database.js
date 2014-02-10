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

var subject = require('../../lib/actions/database');

describe('database action', function() {
  before(function() {
    // chill winston
    winston.remove(winston.transports.Console);
  });

  after(function() {
    winston.add(winston.transports.Console);
  });

  beforeEach(function() {
    this.radio = { sendCommands: sinon.spy() };
  });

  it('triggers whole database update', function() {
    subject(this.radio);

    assert.ok(this.radio.sendCommands.calledWith([
      ['update']
    ]));
  });

  it('triggers partial database update for path', function() {
    subject(this.radio, {path: 'my/music/dir'});

    assert.ok(this.radio.sendCommands.calledWith([
      ['update', 'my/music/dir']
    ]));
  });

  it('forces partial database update for path', function() {
    subject(this.radio, {force: true, path: 'my/music/dir'});

    assert.ok(this.radio.sendCommands.calledWith([
      ['rescan', 'my/music/dir']
    ]));
  });

  it('forces whole database update', function() {
    subject(this.radio, {force: true});

    assert.ok(this.radio.sendCommands.calledWith([
      ['rescan']
    ]));
  });
});

