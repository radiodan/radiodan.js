var Q     = require('q'),
    mpd   = require('mpd'),
    spawn = require('child_process').spawn,
    net   = require('net'),
    logger = require('winston');

exports.client = function (config) {
  var instance = {};

  instance.spawn = function () {
    var mpdProcess = spawn('/usr/local/bin/mpd', [config.path, '--no-daemon']);
    mpdProcess.on('close', function (code, signal) {
      logger.info('MPD Closed: '+signal);
    });

    mpdProcess.stdout.on('data', function (data) {
      logger.info('MPD: ' + data);
    });

    mpdProcess.stderr.on('data', function (data) {
      logger.error('MPD: ' + data);
    });
  }.bind(instance);

  instance.available = function() {
    var deferred = Q.defer(),
        sock = new net.Socket();

    sock.setTimeout(2500);

    sock.on('connect', function() {
      logger.info('connected');
      deferred.resolve();
    });

    sock.on('error', function(error){
      logger.error('error', error);

      setTimeout(function(){
        sock.connect(6600);
      }, 10);
    });

    sock.connect(6600);

    return deferred.promise;
  }.bind(instance);

  instance.connect = function() {
    var deferred = Q.defer();

    this.client = mpd.connect({
      port: 6600,
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
    var deferred = Q.defer(),
        enqueueCommand = this.cmd('add',[filePath]);

    this.client.sendCommand(enqueueCommand, function(err, msg) {
      if(err) {
        deferred.reject(err);
      } else {
        deferred.resolve(msg);
      }
    });

    return deferred.promise;
  }.bind(instance);

  instance.play = function() {
    var playCommand = this.cmd('play', []);
    this.client.sendCommand(playCommand);
  }.bind(instance);

  instance.ready = function() {
    this.spawn();
    return this.available().then(this.connect.bind(this));
  }.bind(instance);

  return instance;
};
