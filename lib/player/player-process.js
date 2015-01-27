var utils        = require('radiodan-client').utils,
    defaultChildProcess = require(__dirname + '/../child-process'),
    playerProcesses = {
      'mpd': mpdProcess,
      'mopidy': mopidyProcess
    };

module.exports.create = function(playerType, configFile, childProcess) {
  var params;

  childProcess = childProcess || defaultChildProcess;

  if(playerProcesses.hasOwnProperty(playerType)) {
    params = playerProcesses[playerType](configFile);
  } else {
    return utils.promise.reject(
        'Unknown player type ' + playerType
    );
  }

  return childProcess.create(playerType, params);
};

function mpdProcess(configFile) {
  return [configFile, '--no-daemon', '--verbose'];
}

function mopidyProcess(configFile) {
  var basic   = ['--config', configFile],
      spotify = [];

  if(process.env.SPOTIFY_USER) {
    spotify = [
      '-o', 'spotify/username='+process.env.SPOTIFY_USER,
      '-o', 'spotify/password='+process.env.SPOTIFY_PASS
    ];
  }

  return spotify.concat(basic);
}

