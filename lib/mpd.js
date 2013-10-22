var Q      = require('q'),
    mpd    = require('mpd'),
    spawn  = require('child_process').spawn,
    fs     = require('fs'),
    net    = require('net'),
    logger = require('winston'),
    mpdConfig = require(__dirname+'/mpd-conf.js');

exports.client = function (config) {
  var instance  = {},
      port      = mpdConfig.port();

  instance.spawn = function (fileName) {
    var deferred = Q.defer(),
        mpdProcess = spawn('/usr/local/bin/mpd', [fileName, '--no-daemon']);

    mpdProcess.on('close', function (code, signal) {
      logger.info('MPD Closed: '+signal);
    });

    mpdProcess.stdout.on('data', function (data) {
      logger.info('MPD: ' + data);
    });

    mpdProcess.stderr.on('data', function (data) {
      logger.error('MPD: ' + data);
    });

    deferred.resolve();

    return deferred.promise;
  }.bind(instance);

  instance.available = function() {
    var deferred = Q.defer(),
        sock = new net.Socket();

    sock.setTimeout(2500);

    sock.on('connect', function() {
      logger.info('connected to '+port);
      deferred.resolve();
    });

    sock.on('error', function(error){
      logger.error('error', error);

      setTimeout(function(){
        sock.connect(port);
      }, 10);
    });

    sock.connect(port);

    return deferred.promise;
  }.bind(instance);

  instance.connect = function() {
    var deferred = Q.defer();

    this.client = mpd.connect({
      port: port,
      host: 'localhost',
    });

    this.client.on('ready', function() {
      logger.info('mpd ready');
      this.cmd = mpd.cmd;
      deferred.resolve();
    }.bind(this));

    return deferred.promise;
  }.bind(instance);

  instance.enqueue = function(filePath) {
    filePath = typeof filePath !== 'undefined' ? filePath : '';
    var deferred = Q.defer();

    return this.sendCommand('add',[filePath]);
  }.bind(instance);

  instance.random = function(isRandom) {
    return this.sendCommand('random', [isRandom]);
  }.bind(instance);

  instance.play = function() {
    return this.sendCommand('play', []);
  }.bind(instance);

  instance.ready = function() {
    config.port = port;
    return mpdConfig.write(config).then(this.spawn)
            .then(this.available).then(this.connect);
  }.bind(instance);

  instance.sendCommand = function(command, params) {
    var deferred = Q.defer(),
        command = this.cmd(command, params);

    this.client.sendCommand(command, function(err, msg) {
      if(err) {
        deferred.reject(err);
      } else {
        deferred.resolve(msg);
      }
    });

    return deferred.promise;
  }.bind(instance);

  return instance;
};
