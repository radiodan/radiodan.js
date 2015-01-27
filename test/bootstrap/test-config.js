'use strict';

var subject = require(libDir + 'bootstrap/config');

describe('bootstrap config', function (){
  beforeEach(function () {
    this.idStub = sinon.stub().returns('genIdx');
  });

  it('returns an array of merged configs', function () {
    var config = {
      'defaults': {
        'music': '~/Music',
        'log'  : '/var/log/'
      },
      'players': [
        { 'id': 'x', 'name': 'My radio', 'music' : '/var/data/music' },
        { 'id': 'x', 'name': 'another one' }
      ]
    };

    var parsedConfigs = subject(config);

    assert.equal(2, parsedConfigs.length);

    assert.deepEqual({ 'id': 'x', 'name': 'My radio', 'music': '/var/data/music', 'log': '/var/log/' }, parsedConfigs[0]);
    assert.deepEqual({ 'id': 'x', 'name': 'another one', 'music': '~/Music', 'log': '/var/log/' }, parsedConfigs[1]);
  });

  it('throws error if no config is passed', function () {
    assert.throw(subject, 'No players found');
  });

  it('throws error if no players are passed', function () {
    var config = {
      'defaults': {
        'music': '~/Music',
        'log'  : '/var/log/'
      },
      'players': null
    };

    assert.throw(function() { subject(config); }, 'No players found');
  });

  it('populates using player data, even without defaults', function () {
    var config = {
      'players': [
        {
          'id'   : 'x',
          'music': '~/Music',
          'log'  : '/var/log/'
        }
      ]
    };

    var parsedConfigs = subject(config);
    assert.equal(1, parsedConfigs.length);
    assert.deepEqual({ 'id': 'x', 'name': 'radiodan_x', 'music': '~/Music', 'log': '/var/log/' }, parsedConfigs[0]);
  });

  it('ignores player ids set in defaults section', function () {
    var config = {
      'defaults': {
        'id' : 'my-radio-id'
      },
      'players': [
        { 'music': '~/Music', 'log': '/var/log/' }
      ]
    };

    var parsedConfigs = subject(config, this.idStub);
    assert.equal(1, parsedConfigs.length);
    assert.deepEqual({ 'id': 'genIdx', 'name': 'radiodan_genIdx', 'music': '~/Music', 'log': '/var/log/' }, parsedConfigs[0]);
  });

  it('creates an id if missing from radio config', function () {
    var config = {
          'players': [
            { 'music': '~/Music', 'log': '/var/log/' },
            { 'music': '~/Music', 'log': '/var/log/' }
          ]
        },
        idStub = sinon.stub();

    idStub.onCall(0).returns('genId1');
    idStub.onCall(1).returns('genId2');

    var parsedConfigs = subject(config, idStub);

    assert.equal(2, parsedConfigs.length);

    assert.deepEqual({ 'id': 'genId1', 'name': 'radiodan_genId1', 'music': '~/Music', 'log': '/var/log/' }, parsedConfigs[0]);
    assert.deepEqual({ 'id': 'genId2', 'name': 'radiodan_genId2', 'music': '~/Music', 'log': '/var/log/' }, parsedConfigs[1]);
  });

  it('throws error when player IDs are not alpha-numeric', function () {
    var config = {
      'players': [
        { 'id': 'my-invalid*id', 'music': '~/Music', 'log': '/var/log/' }
      ]
    };

    assert.throws( function () { subject(config); }, Error);
  });
});
