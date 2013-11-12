var Q      = require('q'),
    spawn  = require('child_process').spawn,
    fs     = require('fs'),
    net    = require('net'),
    logger = require('winston'),
    mpdConfig = require(__dirname+'/mpd-config.js');

exports.create = function(config) {
  var mpdConf = mpdConfig.create(),
      instance = {};

  instance.port = mpdConf.port;

  function waitToBeOnline() {
    var deferred = Q.defer(),
        sock = new net.Socket();

    sock.setTimeout(2500);

    sock.on('connect', function() {
      logger.info('connected to '+instance.port);
      deferred.resolve();
    });

    sock.on('error', function(error) {
      logger.error('error for '+instance.port, error);

      setTimeout(function() {
        sock.connect(instance.port);
      }, 10);
    });

    sock.connect(instance.port);

    return deferred.promise;
  }

  function spawnMPD(fileName) {
    logger.info('spawn');

    var deferred = Q.defer(),
        mpdProcess = spawn('/usr/local/bin/mpd', [fileName, '--no-daemon']);

    mpdProcess.on('close', function(code, signal) {
      logger.info('MPD Closed: '+signal);
    });

    mpdProcess.stdout.on('data', function(data) {
      logger.info('MPD: ' + data);
    });

    mpdProcess.stderr.on('data', function(data) {
      logger.error('MPD: ' + data);
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
