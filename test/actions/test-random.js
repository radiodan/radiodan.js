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
  it('rejects if directory is not present', function(done){
    var radio = { sendCommands: sinon.spy() };

    var promise = subject(radio, {LOL: 'podcasts'});
    assert.isRejected(promise).then(function(){
      assert.equal(0, radio.sendCommands.callCount);
      done();
    });
  });

  it('sends commands to mpd', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {directory: 'podcasts'});

    assert(radio.sendCommands.calledWith([
      ['clear'], ['add', 'podcasts'], ['random', '1'], ['play']
    ]));
  });
});

