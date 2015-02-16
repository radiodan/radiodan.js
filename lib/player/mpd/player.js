'use strict';

var configFile    = require('./config'),
    portFinder    = require(__dirname + '/../../port-finder').create(),
    mpdClient     = require('./client'),
    waitForSocket = require(__dirname + '/../../wait-for-socket'),
    playerProcess = require('./player-process'),
    utils         = require('radiodan-client').utils,
    logger = utils.logger(__filename);

module.exports.create = function(options) {
  var instance = {},
      playerType;

  options = options || {};

  instance.start = function() {
    // parse config
    return portFinder.next(2)
      .then(function(openPorts) {
        var playerConfig = configFile.create(options, openPorts);
        return playerConfig.write(options);
      })
      .then(function(configAndPort) {
        var configFile = configAndPort[0],
            port = configAndPort[1],
            playerType = options.player;

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
