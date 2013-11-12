var Q      = require('q'),
    mpd    = require('mpd'),
    logger = require('winston');

exports.client = function (port) {
  var instance = {};
  console.log('client', port);

  instance.connect = function() {
    console.log('connect', port);
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

  instance.ready = function(mpdReady) {
    return mpdReady.then(this.connect);
  }.bind(instance);

  instance.sendCommand = function(command, params) {
    var deferred = Q.defer(),
        mpdCommand = this.cmd(command, params);

    this.client.sendCommand(mpdCommand, function(err, msg) {
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
