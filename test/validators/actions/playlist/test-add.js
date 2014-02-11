/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

chai.use(chaiAsPromised);

var subject = require('../../../../lib/validators/actions/playlist/add');

describe('validate play action', function() {
  it('resolves with correct options', function(done) {
    var promise = subject({
      playlist: ['track.mp3']
    });

    assert.becomes(promise, { playlist: ['track.mp3'], clear: false })
          .notify(done);
  });

  it('rejects if playlist is not empty', function(){
    var promise = subject({playlist: []});
    assert.isRejected(promise, Error);
  });
});

