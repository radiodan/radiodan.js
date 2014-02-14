/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

chai.use(chaiAsPromised);

var subject = require('../../../lib/actions/playlist/move');

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

