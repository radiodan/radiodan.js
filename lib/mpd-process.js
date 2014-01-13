var Q      = require('q'),
    spawn  = require('child_process').spawn,
    fs     = require('fs'),
    net    = require('net'),
    logger = require('winston'),
    waitForSocket = require('./wait-for-socket.js'),
    mpdConfig = require(__dirname+'/mpd-config.js');

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
    var deferred = Q.defer(),
        mpdProcess = spawn('/usr/local/bin/mpd', [fileName, '--no-daemon']);

    mpdProcess.on('close', function(code, signal) {
      logger.error('MPD Closed: ' + code);
    });

    mpdProcess.stdout.on('data', function(data) {
      logger.info('MPD: ' + data);
    });

    mpdProcess.stderr.on('data', function(data) {
      logger.warn('MPD: ' + data);
    });

    deferred.resolve();

    return deferred.promise;
  }

  instance.start = function() {
    return mpdConf.write(config).then(spawnMPD)
      .then(waitToBeOnline);
  };

  return instance;
};
