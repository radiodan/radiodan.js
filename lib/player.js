'use strict';

var configFile    = require(__dirname + '/player/config'),
    portFinder    = require(__dirname + '/port-finder').create(),
    mpdClient     = require(__dirname + '/player/mpd/client'),
    waitForSocket = require(__dirname + '/wait-for-socket'),
    playerProcess = require(__dirname + '/player/player-process'),
    utils         = require('radiodan-client').utils,
    logger = utils.logger(__filename);

module.exports.create = function(options) {
  var instance = {},
      playerConfig,
      playerClient,
      playerType,
      openPorts;

  options = options || {};
  playerType = options.player;

  openPorts     = portFinder.next(2);
  playerConfig  = configFile.create(options, openPorts);

  instance.start = function() {
    // parse config
    return playerConfig.write(options)
      .then(function(configAndPort) {
        var configFile = configAndPort[0],
            port = configAndPort[1];

        // spawn process
        return playerProcess.create(playerType, configFile)
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
