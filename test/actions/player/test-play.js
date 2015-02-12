var subject = require(libDir + '/actions/player/play');

describe('player.play action', function() {
  it('sends the play command', function() {
    var radio = { sendCommands: sinon.spy() };

    var volumePromise = subject(radio, {});

    assert.ok(radio.sendCommands.calledWith([
      ['play']
    ]));
  });

  it('sends position if specified', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {position: 10});

    assert.ok(radio.sendCommands.calledWith([
        ['play', 10]
    ]));
  });

  it('sends the play command with position 0', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {position: 0});

    assert.ok(radio.sendCommands.calledWith([
        ['play', 0]
    ]));
  });
});
