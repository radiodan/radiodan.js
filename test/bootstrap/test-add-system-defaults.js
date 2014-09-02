/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

chai.use(chaiAsPromised);

var subject = require('../../lib/bootstrap/add-system-defaults');

describe('bootstrap add system defaults', function (){
  it('Adds mpd paths to root', function () {
    var defaults = subject.create('/tmp/radiodan/'),
        config   = defaults.add({id: 123});

    assert.equal('/tmp/radiodan/123/music/', config.music);
    assert.equal('/tmp/radiodan/123/playlists/', config.playlist);
    assert.equal('/tmp/radiodan/123/mpd.db', config.db);
  });

  it('adds default values to config', function() {
    var defaults = subject.create(),
        config   = defaults.add({id: 123});

    assert.equal('/var/lib/radiodan/radios/123/music/', config.music);
    assert.equal('/var/lib/radiodan/radios/123/playlists/', config.playlist);
    assert.equal('/var/lib/radiodan/radios/123/mpd.db', config.db);
    assert.equal('syslog', config.log);
    assert.equal(false, config.httpStreaming);
    assert.equal('mpd', config.player);

    // this is dependent on o/s running tests
    assert.ok(['coreAudio', 'alsa'].indexOf(config.platform) > -1);
  });

  it('leaves config settings alone', function() {
    var defaults = subject.create(),
        config   = defaults.add({id: 123, log: '/var/log'});

    assert.equal('/var/log', config.log);
    assert.equal('/var/lib/radiodan/radios/123/playlists/', config.playlist);
  });
});
