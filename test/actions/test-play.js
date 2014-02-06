/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

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

  it('sets play position', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {
      playlist: ['track0.mp3', 'track1.mp3'],
      playNow: true, playPosition: '1'
    });

    assert.equal(1, radio.sendCommands.callCount);
    assert.ok(radio.sendCommands.calledWith([
      ['clear'], ['add', 'track0.mp3'], ['add', 'track1.mp3'], ['random', '0'],
      ['play', '1']
    ]));
  });

  it('rejects if position is larger that playlist', function(done) {
    var radio = { sendCommands: sinon.spy() };

    var promise = subject(radio, {
      playlist: ['track.mp3'], playNow: true, playPosition: '3'
    });

    assert.isRejected(promise).then(function(){
      assert.equal(0, radio.sendCommands.callCount);
      done();
    });
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

