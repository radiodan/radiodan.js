/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

chai.use(chaiAsPromised);

var subject = require('../../lib/states/playlist');

describe('playlist action', function() {
  it('requests current playlist', function() {
    var response = utils.promise.resolve(),
        radio = { sendCommands: sinon.stub().returns(response) };

    subject(radio);

    assert.equal(1, radio.sendCommands.callCount);
    assert.ok(radio.sendCommands.calledWith([
      ['playlistinfo']
    ]));
  });

  it('formats playlist', function(done) {
    var playlistArray = [
          ['file', '1.mp3'], ['Track', 'Track1'],
          ['Artist', 'Artist1'],
          ['file', '2.mp3'], ['Track', 'Track2'],
          ['Artist', 'Artist2']
        ],
        statusPromise = utils.promise.resolve(),
        radio = {
          sendCommands: sinon.stub().returns(statusPromise),
          formatResponse: sinon.stub().returns(playlistArray)
        };

    var promise = subject(radio);

    assert.isFulfilled(promise).then(function(response) {
      assert.equal(1, radio.formatResponse.callCount);
      assert.equal(2, response.length);
      assert.deepEqual(
        {'file': '1.mp3', 'Track': 'Track1', 'Artist': 'Artist1'},
        response[0]);
      assert.deepEqual(
        {'file': '2.mp3', 'Track': 'Track2', 'Artist': 'Artist2'},
        response[1]);
      done();
    });
  });
});

