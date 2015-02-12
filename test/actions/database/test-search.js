'use strict';

var subject = require(libDir + 'actions/database/search');

describe('search action', function() {
  beforeEach(function() {
    this.radio = { sendCommands: sinon.stub() };
  });

  it('appends terms to search command', function() {
    this.radio.sendCommands.returns(utils.promise.resolve(''));

    subject(this.radio, {terms: ['artist', 'Bob', 'album', 'Legend']});

    assert.ok(this.radio.sendCommands.calledWith([
      ['search', 'artist', 'Bob', 'album', 'Legend']
    ]));
  });
});

