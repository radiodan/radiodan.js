var configFile   = require(__dirname + '/player/config'),
    childProcess = require(__dirname + '/child-process'),
    portFinder   = require(__dirname + '/port-finder').create(),
    mpdClient    = require(__dirname + '/player/mpd/client'),
    waitForSocket= require(__dirname + '/wait-for-socket'),
    utils        = require('radiodan-client').utils,
    logger = utils.logger(__filename),
    playerProcesses = {
      'mpd': ['--no-daemon', '--verbose'],
      'mopidy': [''],
    };

module.exports.create = function(options) {
  var instance = {},
      playerConfig,
      playerProcess,
      playerClient,
      playerType,
      openPorts;

  options = options || {};
  playerType = options.player;

  if(!playerProcesses.hasOwnProperty(playerType)) {
    return utils.promise.reject(
        'Unknown player type ' + playerType
    );
  }

  openPorts     = portFinder.next(2);
  playerConfig  = configFile.create(options, openPorts);

  instance.start = function() {
    // parse config
    return playerConfig.write(options)
      .then(function(configAndPort) {
        var configFile = configAndPort[0],
        port = configAndPort[1],
        params = JSON.parse(JSON.stringify(playerProcesses[playerType]));

        params.unshift(configFile);

        // spawn process
        return childProcess.create(playerType, params)
          .then(function() { return port; });
      }).then(function(port) {
        options.port = port;

        // attach client to process
        // (wait for socket availability)
        return waitForSocket.create(port).connect().then(function() {
          return mpdClient.create(options).connect();
        });
      }).then(null, utils.failedPromiseHandler(logger));
  };

  return instance;
};

