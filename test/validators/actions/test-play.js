/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

chai.use(chaiAsPromised);

var subject = require('../../../lib/validators/actions/play');

describe('validate play action', function() {
  it('resolves with correct options', function(done) {
    var promise = subject({
      playlist: ['track.mp3'], playNow: null, playPosition: '3'
    });

    assert.becomes(promise, { playlist: ['track.mp3'], playNow: false })
          .notify(done);
  });

  it('resolves with a default position if play now flag is set', function(done) {
    var promise = subject({
      playlist: ['track.mp3'], playNow: true
    });

    assert.becomes(promise, { playlist: ['track.mp3'], playNow: true, position: '0'})
          .notify(done);
  });

  it('rejects if position is larger that playlist', function(done) {
    var promise = subject({
      playlist: ['track.mp3'], playNow: true, playPosition: '3'
    });

    assert.isRejected(promise, Error).notify(done);
  });
  
  it('rejects if playlist is not empty', function(){
    var promise = subject({playlist: []});
    assert.isRejected(promise, Error);
  });
});

