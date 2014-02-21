var spawn  = require('child_process').spawn,
    fs     = require('fs'),
    net    = require('net'),

    utils  = require('radiodan-client').utils,
    logger = utils.logger(__filename),

    waitForSocket   = require('../wait-for-socket'),
    mpdChildProcess = require('./mpd-child-process'),
    mpdConfig       = require('./mpd-config');

exports.create = function(config) {
  var mpdConf = mpdConfig.create(),
      instance = {};

  instance.start = function() {
    return mpdConf
      .write(config)
      .then(spawnMPD)
      .then(waitToBeOnline);
  };

  return instance;
};

function waitToBeOnline(port) {
  return waitForSocket
    .create(port)
    .connect();
}

function spawnMPD(args) {
  var fileName = args[0],
      port     = args[1];

  function returnPort() {
    return port;
  }

  return mpdChildProcess.create(fileName).then(returnPort);
}
