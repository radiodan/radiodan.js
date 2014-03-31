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

var subject = require('../../lib/mpd/mpd-config');

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

  it('generates a config file populated by supplied object', function (done) {
    var mpdConfig = subject.create();
    var built = mpdConfig.build(this.configObject);

    assert.isFulfilled(built).then(function(mpdContent) {
      // music
      assert.match(mpdContent,
        /^music_directory (\s+) "~\/music"$/m);
      // playlist
      assert.match(mpdContent,
        /^playlist_directory (\s+) "~\/music\/playlists"$/m);
      // db
      assert.match(mpdContent,
        /^db_file (\s+) "~\/music\/mpd\.db"$/m);
      // log
      assert.match(mpdContent,
        /^log_file (\s+) "\/var\/log\/mpd\.log"$/m);
    }).then(done,done);
  });

  it('assigns ports', function(done) {
    var firstConfig  = subject.create(),
        secondConfig = subject.create(),
        firstBuild   = firstConfig.build({}, [6600]),
        secondBuild  = secondConfig.build({}, [6601]);

    assert.isFulfilled(firstBuild).then(function(mpdContent) {
      return assert.match(mpdContent, /^port (\s+) "6600"$/m);
    }).then(function(){
      return assert.isFulfilled(secondBuild).then(function(mpdContent) {
        assert.match(mpdContent, /^port (\s+) "6601"$/m);
      })
    }).then(done,done);
  });

  it('assigns HTTP port', function(done) {
    var config = this.configObject;
    config.httpStreaming = true;

    var mpdConfig = subject.create(),
        built = mpdConfig.build(config, [null, 8000]);

    assert.isFulfilled(built).then(function(mpdContent) {
      assert.match(mpdContent, /port (\s+) "8000"$/m);
    }).then(done,done);
  });

  it('sets audio output format', function(done) {
    var mpdConfig = subject.create(),
        built = mpdConfig.build({platform: "coreAudio", audioOutput: 'mono'}, []);

    assert.isFulfilled(built).then(function(mpdContent) {
      assert.match(mpdContent, /format (\s+) "44100:16:1"$/m);
    }).then(done,done);
  });

  it('generates a platform-specific boolean key', function(done) {
    var config = this.configObject;
    config.platform = "coreAudio";

    var mpdConfig = subject.create();
    var built = mpdConfig.build(config);

    assert.isFulfilled(built).then(function(mpdContent) {
      assert.match(mpdContent, /type\s* "osx"$/m);
    }).then(done,done);
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

    assert.isFulfilled(promise).then(function (args) {
      var filePath = args[0];
      assert(fs.existsSync(filePath));
    }).then(done, done);
  });
});
