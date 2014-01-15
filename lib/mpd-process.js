var Q      = require('q'),
    spawn  = require('child_process').spawn,
    fs     = require('fs'),
    net    = require('net'),
    logger = require('winston'),

    waitForSocket   = require('./wait-for-socket'),
    mpdChildProcess = require('./mpd-child-process'),
    mpdConfig       = require('./mpd-config');

exports.create = function(config) {
  var mpdConf = mpdConfig.create(),
      instance = {};

  instance.port = mpdConf.port;

  function waitToBeOnline() {
    return waitForSocket
              .create(instance.port)
              .connect();
  }

  function spawnMPD(fileName) {
    return mpdChildProcess.create(fileName);
  }

  instance.start = function() {
    return mpdConf
      .write(config)
      .then(spawnMPD)
      .then(waitToBeOnline);
  };

  return instance;
};
