'use strict';

var subject = require(libDir + 'player/mpd/actions/toggle-command');

describe('toggle command meta-action', function() {
  it('sends the given command with a value', function() {
    var radio = { sendCommands: sinon.spy() };

    subject('mycommand')(radio, { value: 0 });

    assert.deepEqual(
      [['mycommand', 0]],
      radio.sendCommands.firstCall.args[0]
    );
  });
});
