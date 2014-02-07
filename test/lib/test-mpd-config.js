/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon'),
    winston = require('winston'),
    fs     = require('fs'),
    EventEmitter = require('events').EventEmitter;

var utils = require('radiodan-client').utils;

chai.use(chaiAsPromised);

var subject = require('../../lib/mpd-config');

describe('mpdConfig', function (){
  before(function() {
    // chill winston
    winston.remove(winston.transports.Console);
  });

  after(function() {
    winston.add(winston.transports.Console);
  });

  beforeEach(function () {
    this.configObject = {
      music: '~/music',
      playlist: '~/music/playlists',
      db: '~/music/mpd.db',
      log: '/var/log/mpd.log'
    };
  });

  it('generates a config file populated by supplied object', function () {
    var mpdConfig = subject.create();
    var mpdContent = mpdConfig.build(this.configObject);

    // music
    assert.match(mpdContent, /^music_directory (\s+) "~\/music"$/m);
    // playlist
    assert.match(mpdContent, /^playlist_directory (\s+) "~\/music\/playlists"$/m);
    // db
    assert.match(mpdContent, /^db_file (\s+) "~\/music\/mpd\.db"$/m);
    // log
    assert.match(mpdContent, /^log_file (\s+) "\/var\/log\/mpd\.log"$/m);
  });

  it('provides its own port assignment', function() {
    subject.resetPortNumber();

    var portConfig = this.configObject;
    portConfig.port = 7171;

    var mpdConfig = subject.create();
    var mpdContent = mpdConfig.build(this.configObject);

    assert.match(mpdContent, /^port (\s+) "6600"$/m);

    var mpdConfig = subject.create();
    var mpdContent = mpdConfig.build(this.configObject);
    assert.match(mpdContent, /^port (\s+) "6601"$/m);
  });

  it('provides its own HTTP port assignment', function() {
    subject.resetPortNumber();

    var config = this.configObject;
    config.httpPort = 7171;
    config.httpStreaming = true;

    var mpdConfig = subject.create();
    var mpdContent = mpdConfig.build(config);

    assert.match(mpdContent, /port (\s+) "8000"$/m);

    var mpdConfig = subject.create();
    var mpdContent = mpdConfig.build(config);
    assert.match(mpdContent, /port (\s+) "8001"$/m);
  });

  it('generates a platform-specific boolean key', function() {
    subject.resetPortNumber();

    var config = this.configObject;
    config.platform = "coreAudio";

    var mpdConfig = subject.create();
    var mpdContent = mpdConfig.build(config);

    assert.match(mpdContent, /type "osx"$/m);
  });

  it('generates a temporary file path to write to', function (done) {
    var mpdConfig = subject.create(),
        promise = mpdConfig.fileName();

    assert.isFulfilled(promise).then(function (filePath) {
      assert.notOk(fs.existsSync(filePath));
      done();
    });
  });

  it('writes config to a file', function (done) {
    var mpdConfig = subject.create(),
        promise = mpdConfig.write(this.configObject);

    assert.isFulfilled(promise).then(function (filePath) {
      assert(fs.existsSync(filePath));
      done();
    });
  });
});
