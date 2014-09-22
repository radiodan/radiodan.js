var subject = require(libDir + '/actions/database/update');

describe('database action', function() {
  beforeEach(function() {
    this.radio = { sendCommands: sinon.spy() };
  });

  it('triggers whole database update', function() {
    subject(this.radio);

    assert.ok(this.radio.sendCommands.calledWith([
      ['update']
    ]));
  });

  it('triggers partial database update for path', function() {
    subject(this.radio, {path: 'my/music/dir'});

    assert.ok(this.radio.sendCommands.calledWith([
      ['update', 'my/music/dir']
    ]));
  });

  it('forces partial database update for path', function() {
    subject(this.radio, {force: true, path: 'my/music/dir'});

    assert.ok(this.radio.sendCommands.calledWith([
      ['rescan', 'my/music/dir']
    ]));
  });

  it('forces whole database update', function() {
    subject(this.radio, {force: true});

    assert.ok(this.radio.sendCommands.calledWith([
      ['rescan']
    ]));
  });
});

