var subject = require(libDir + 'actions/playlist/load');

describe('playlist.load action', function() {
  it('load given tracks to current playlist', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {playlist: ['track.m3u']});
    assert.equal(1, radio.sendCommands.callCount);
    assert.deepEqual(
      [['load', 'track.m3u']],
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
      ['clear'], ['load', 'track0.m3u'], ['load', 'track1.m3u']
    ], radio.sendCommands.firstCall.args[0]);
  });
});
