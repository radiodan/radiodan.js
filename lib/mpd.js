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
};

MPD.prototype.enqueue = function(filePath) {
  filePath = 'iTunes/iTunes Media/Music/Queens of the Stone Age/…Like Clockwork/02 I Sat By The Ocean.mp3';
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
}

MPD.prototype.play = function() {
  console.log('play');
  var playCommand = this.cmd('play', []);
  this.client.sendCommand(playCommand);
};

MPD.prototype.ready = function() {
  this.spawn();
  return this.available().then(this.connect.bind(this));
};

exports.MPD = MPD;
