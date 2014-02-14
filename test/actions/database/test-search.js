/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

var utils = require('radiodan-client').utils;

chai.use(chaiAsPromised);

var subject = require('../../../lib/actions/database/search');

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

