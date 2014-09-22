var subject = require(libDir + '/actions/toggle-command');

describe('toggle command meta-action', function() {

  it('sends the given command with a value', function() {
    var radio = { sendCommands: sinon.spy() };

    subject('mycommand')(radio, { value: 0 });

    assert.ok(radio.sendCommands.calledWith([
      ['mycommand', 0]
    ]));
  });

});

