var Q = require('q'),
    mpd = require('mpd'),
    spawn = require('child_process').spawn,
    net = require('net');

var MPD = function(){};

MPD.prototype.spawn = function(){
  var mpdProcess = spawn('/usr/local/bin/mpd', ['/Users/dan/.mpd/mpd.conf', '--no-daemon']);
  mpdProcess.on('close', function (code, signal) {
    console.log('MPD Closed: '+signal);
  });

  mpdProcess.stdout.on('data', function (data) {
    console.log('MPD: ' + data);
  });

  mpdProcess.stderr.on('data', function (data) {
    console.error('MPD: ' + data);
  });
}

MPD.prototype.available = function() {
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
};

MPD.prototype.connect = function() {
  var deferred = Q.defer();
  this.client = mpd.connect({
    port: 6600,
    host: 'localhost',
  });

  this.client.on('ready', function() {
    this.cmd = mpd.cmd;
    deferred.resolve();
  }.bind(this));

  return deferred.promise;
};

MPD.prototype.enqueue = function() {
  var deferred = Q.defer(),
    enqueueCommand = this.cmd('add',['iTunes/iTunes Media/Music/Queens of the Stone Age/…Like Clockwork/02 I Sat By The Ocean.mp3']);

  this.client.sendCommand(enqueueCommand, function(err, msg) {
    if(err) { 
      deferred.reject(err);
    } else {
      deferred.resolve(msg);
    }
  });

  return deferred.promise;
}

MPD.prototype.play = function() {
  var playCommand = this.cmd('play', []);
  this.client.sendCommand(playCommand);
};

MPD.prototype.ready = function() {
  this.spawn();
  return this.available().then(this.connect);
};

exports.MPD = MPD;
