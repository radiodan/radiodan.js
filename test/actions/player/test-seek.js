'use strict';

var subject = require(libDir + '/actions/player/seek');

describe('player.seek action', function() {
  it('sends the seek current command with seek time', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {time: -43});

    assert.ok(radio.sendCommands.calledWith([
      ['seekcur', -43]
    ]));
  });

  it('sends the seek command with playlist position and seek time', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {position: 2, time: 33});

    assert.ok(radio.sendCommands.calledWith([
      ['seek', 2, 33]
    ]));
  });
});

