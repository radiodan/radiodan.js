var Q = require('q');

var MPD = function(){
  var spawn = require('child_process').spawn;
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

MPD.prototype.ready = function() {
  var net = require('net');
  var sock = new net.Socket();
  var deferred = Q.defer();
  
  var tryConnect = function() {
    sock.setTimeout(2500);
    sock.on('connect', function() {
      console.log('connected');
      deferred.resolve();
      sock.destroy();
    });

    sock.on('error', function(error){
      console.log('error', error);
      setTimeout(tryConnect, 10);
      sock.destroy();
    });

    sock.connect(6600);
  };

  tryConnect();

  return deferred.promise;
}

function enqueueAndPlay(){
  console.log('enqueueAndPlay');
  var mpd = require('mpd'),
      cmd = mpd.cmd;

  var client = mpd.connect({
    port: 6600,
    host: 'localhost',
  });

  client.on('ready', function() {
    console.log("ready");
    client.sendCommand(mpd.cmd('add',['iTunes/iTunes Media/Music/Queens of the Stone Age/…Like Clockwork/02 I Sat By The Ocean.mp3']), function(err, msg) {
      console.log(msg);
      client.sendCommand(mpd.cmd('play', []));
    });
  });
};

//waitForMPD(enqueueAndPlay);

// spawn MPD
var mpd = new MPD();
// add track to playlist
var promise = mpd.ready();
console.log('promise', promise);
promise.then(enqueueAndPlay)//.then(play)
// play playlist
