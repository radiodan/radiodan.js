var subject = require(libDir + 'actions/playlist/add');

describe('playlist.add action', function() {
  it('adds given tracks to current playlist', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {playlist: ['track.mp3']});
    assert.equal(1, radio.sendCommands.callCount);
    assert.ok(radio.sendCommands.calledWith([
      ['add', 'track.mp3']
    ]));
  });

  it('clears current playlist if clear flag is set', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {
      playlist: ['track0.mp3', 'track1.mp3'],
      clear: true
    });

    assert.equal(1, radio.sendCommands.callCount);
    assert.ok(radio.sendCommands.calledWith([
      ['clear'], ['add', 'track0.mp3'], ['add', 'track1.mp3']
    ]));
  });
});

