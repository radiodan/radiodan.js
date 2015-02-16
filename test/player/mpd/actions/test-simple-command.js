'use strict';

var subject = require(libDir + 'player/mpd/actions/simple-command');

describe('simple-command action wrapper', function() {
  it('sends a single command only', function() {
    var radio = { sendCommands: sinon.spy() },
        command = 'myCommand';

    subject(command)(radio, {});

    assert.deepEqual(
      [['myCommand']],
      radio.sendCommands.firstCall.args[0]
    );
  });

  it('doesn\'t do anything with options', function() {
    var radio = { sendCommands: sinon.spy() };

    subject('anotherCommand')(radio, {value: 999999});

    assert.deepEqual(
      [['anotherCommand']],
      radio.sendCommands.firstCall.args[0]
    );
  });
});
