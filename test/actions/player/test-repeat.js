var subject = require(libDir + 'actions/player/repeat');

describe('player.repeat action', function() {
  it('sets the repeat action', function() {
    var radio = { sendCommands: sinon.spy() };

    var volumePromise = subject(radio, {value: true});

    assert.ok(radio.sendCommands.calledWith([
      ['repeat', true]
    ]));
  });

  it('cancels the repeat action', function() {
    var radio = { sendCommands: sinon.spy() };

    var volumePromise = subject(radio, {value: false});

    assert.ok(radio.sendCommands.calledWith([
      ['repeat', false]
    ]));
  });
});
