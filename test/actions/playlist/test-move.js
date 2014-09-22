var subject = require(libDir + '/actions/playlist/move');

describe('playlist.move action', function() {
  it('moves given tracks in playlist', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {from: '2', to: '44'});
    assert.equal(1, radio.sendCommands.callCount);
    assert.ok(radio.sendCommands.calledWith([
      ['move', '2', '44']
    ]));
  });
});

