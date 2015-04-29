'use strict';

var subject = require(libDir + 'player/mopidy/actions/playlist/load');

describe('playlist.load action', function() {
  it('adds given tracks to current playlist', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {playlist: ['track.m3u']});
    assert.equal(1, radio.sendCommands.callCount);
    assert.deepEqual(
      [['add', 'track.m3u']],
      radio.sendCommands.firstCall.args[0]
    );
  });

  it('clears current playlist if clear flag is set', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {
      playlist: ['track0.m3u', 'track1.m3u'],
      clear: true
    });

    assert.equal(1, radio.sendCommands.callCount);
    assert.deepEqual([
      ['clear'], ['add', 'track0.m3u'], ['add', 'track1.m3u']
    ], radio.sendCommands.firstCall.args[0]);
  });
});
