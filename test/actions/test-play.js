/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon'),
    winston = require('winston'),
    fs     = require('fs'),
    EventEmitter = require('events').EventEmitter;

var utils = require('../../lib/utils');

chai.use(chaiAsPromised);

var subject = require('../../lib/actions/play');

describe('play action', function() {
  it('sets a new playlist to run sequentially', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {playlist: ['track.mp3'], playNow: false});
    assert.equal(1, radio.sendCommands.callCount);
    assert.ok(radio.sendCommands.calledWith([
        ['clear'], ['add', 'track.mp3'], ['random', '0']
    ]));
  });

  it('adds play command if flag is set', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {playlist: ['track.mp3'], playNow: true});
    assert.equal(1, radio.sendCommands.callCount);
    assert.ok(radio.sendCommands.calledWith([
      ['clear'], ['add', 'track.mp3'], ['random', '0'], ['play', '0']
    ]));
  });

  it('rejects if playlist is not empty', function(done){
    var radio = { sendCommands: sinon.spy() };

    var promise = subject(radio, {playlist: []});
    assert.isRejected(promise).then(function(){
      assert.equal(0, radio.sendCommands.callCount);
      done();
    });
  });
});

