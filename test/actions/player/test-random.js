var subject = require(libDir + 'actions/player/random');

describe('player.random action', function() {
  it('sets the random action', function() {
    var radio = { sendCommands: sinon.spy() };

    var volumePromise = subject(radio, {value: true});

    assert.ok(radio.sendCommands.calledWith([
      ['random', true]
    ]));
  });

  it('cancels the random action', function() {
    var radio = { sendCommands: sinon.spy() };

    var volumePromise = subject(radio, {value: false});

    assert.ok(radio.sendCommands.calledWith([
      ['random', false]
    ]));
  });
});
