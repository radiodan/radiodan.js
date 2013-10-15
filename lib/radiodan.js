var cp = require('child_process').spawn;
var mpdProcess = cp('/usr/local/bin/mpd', ['/Users/dan/.mpd/mpd.conf', '--no-daemon']);

process.on('exit', function() {
  console.log('Terming...');
  mpdProcess.kill();
  process.exit(0);
});

mpdProcess.on('close', function (code, signal) {
    console.log('child process terminated due to receipt of signal '+signal);
});

mpdProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

mpdProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

var mpd = require('mpd'),
    cmd = mpd.cmd

setTimeout(function(){
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

}, 10);
