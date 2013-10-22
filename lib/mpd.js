var Q      = require('q'),
    mpd    = require('mpd'),
    spawn  = require('child_process').spawn,
    fs     = require('fs'),
    net    = require('net'),
    logger = require('winston');

exports.client = function (config) {
  var instance = {};
  var mpdConf, port;

  instance.spawn = function () {
    try {
      mpdConf = fs.readFileSync(config.path, {encoding: 'utf8'});
      port = mpdConf.match(/^port[\t|\s]+"(\d+)"/i)[1];
    } catch (ENOENT) {
      logger.error('MPD config file '+config.path +' not found');
      process.exit(1);
    }

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

  instance.random = function(isRandom) {
    return this.sendCommand('random', [isRandom]);
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

  instance.play = function() {
    return this.sendCommand('play', []);
  }.bind(instance);

  instance.ready = function() {
    this.spawn();
    return this.available().then(this.connect.bind(this));
  }.bind(instance);

  return instance;
};
