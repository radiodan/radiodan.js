var cp = require('child_process'),
    mpdPath = '',
    mpd = require('mpd'),
    cmd = mpd.cmd;

process.on('exit', function() {
  console.log('Terming...');
  mpdProcess.kill();
  process.exit(0);
});

function spawnMPD(mpdPath) {
  var mpdProcess = cp.spawn(mpdPath.trim(), ['/Users/dan/.mpd/mpd.conf', '--no-daemon']);

  mpdProcess.on('close', function (code, signal) {
    console.log('child process terminated due to receipt of signal ', signal, code);
  });

  mpdProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  mpdProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
}

function mpdConnect() {
  var client = mpd.connect({
    port: 6600,
    host: 'localhost',
  });

  client.on('ready', function() {
    console.log("ready");
    client.sendCommand(mpd.cmd('listall', ['']), function(err, msg) {
      console.log(msg);
      client.sendCommand(mpd.cmd('add',['']), function(err, msg) {
        console.log(msg);
        client.sendCommand(mpd.cmd('play', []));
      });
    });
  });
}

cp.exec('which mpd', [], function(error, stdout, stderror){
  if(stderror) console.log('error: '+stderror);
  spawnMPD(stdout);
  setTimeout(mpdConnect, 10);
});

