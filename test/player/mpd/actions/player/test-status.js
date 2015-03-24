'use strict';

var subject = require(libDir + 'player/mpd/actions/player/status');

describe('player.status action', function() {
  it('requests player and playlist from state', function() {
    var radio     = sinon.stub(),
        mockState = { invoke: sinon.spy() };

    subject(radio, null, mockState);

    assert.deepEqual(mockState.invoke.firstCall.args, [
      radio, 'player'
    ]);

    assert.deepEqual(mockState.invoke.secondCall.args, [
      radio, 'playlist'
    ]);
  });

  it('combines state requests into single object', function(done) {
    var radio     = sinon.stub(),
        mockState = { invoke: sinon.stub() };

    mockState.invoke.withArgs(radio, 'player').returns('player');
    mockState.invoke.withArgs(radio, 'playlist').returns('playlist');

    var statePromise = subject(radio, null, mockState);

    statePromise.then(function(response) {
      assert.deepEqual(
        response,
        {player: 'player', playlist: 'playlist'}
      );
    }).then(done, done);
  });
});
