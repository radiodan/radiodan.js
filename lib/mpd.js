var Q = require('q'),
    mpd = require('mpd'),
    spawn = require('child_process').spawn,
    net = require('net');

exports.client = function (config) {
  var instance = {};

  instance.spawn = function () {
    var mpdProcess = spawn('/usr/local/bin/mpd', [config.path, '--no-daemon']);
    mpdProcess.on('close', function (code, signal) {
      console.log('MPD Closed: '+signal);
    });

    mpdProcess.stdout.on('data', function (data) {
      console.log('MPD: ' + data);
    });

    mpdProcess.stderr.on('data', function (data) {
      console.error('MPD: ' + data);
    });
  }.bind(instance);

  instance.available = function() {
    var deferred = Q.defer(),
        sock = new net.Socket();

    sock.setTimeout(2500);

    sock.on('connect', function() {
      console.log('connected');
      deferred.resolve();
    });

    sock.on('error', function(error){
      console.log('error', error);

      setTimeout(function(){
        sock.connect(6600);
      }, 10);
    });

    sock.connect(6600);

    return deferred.promise;
  }.bind(instance);

  instance.connect = function() {
    var deferred = Q.defer();
    var self = this;
    this.client = mpd.connect({
      port: 6600,
      host: 'localhost',
    });

    this.client.on('ready', function() {
      console.log('mpd ready', self);
      self.cmd = mpd.cmd;
      deferred.resolve();
    });

    return deferred.promise;
  }.bind(instance);

  instance.enqueue = function(filePath) {
    console.log('enqueue', filePath);
    console.log('this', this);

    var deferred = Q.defer();
    console.log('def', this.cmd);

    var enqueueCommand = this.cmd('add',[filePath]);
    console.log('enqueu');

    console.log('cmd', enqueueCommand);

    this.client.sendCommand(enqueueCommand, function(err, msg) {
      if(err) {
        console.log('ERR', err);
        deferred.reject(err);
      } else {
        console.log('play', msg);
        deferred.resolve(msg);
      }
    });

    return deferred.promise;
  }.bind(instance);

  instance.play = function() {
    console.log('play');
    var playCommand = this.cmd('play', []);
    this.client.sendCommand(playCommand);
  }.bind(instance);

  instance.ready = function() {
    this.spawn();
    return this.available().then(this.connect.bind(this));
  }.bind(instance);

  return instance;
};
