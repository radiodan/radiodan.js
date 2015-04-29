'use strict';

var utils           = require('radiodan-client').utils,
    MessagingClient = require('radiodan-client').MessagingClient,
    MpdPlayer       = require('./player/mpd'),
    MopidyPlayer    = require('./player/mopidy'),
    radioController = require('./radio-controller'),
    logger;

var players = [MpdPlayer, MopidyPlayer];

exports.create = function(config, logger) {
  var playerModule;

  logger = logger || utils.logger(__filename);

  playerModule = getPlayerFromConfig(config, logger);

  return playerModule.player.create(config).start()
    .then(function(player) {
      return bindToController(player, playerModule.action, playerModule.state);
    })
    .then(null, utils.failedPromiseHandler(logger));
};

function bindToController(player, action, state) {
  var messagingClient = MessagingClient.create();
  radioController.create(player, action, state, messagingClient);

  return player;
}

function getPlayerFromConfig(config, logger) {
  var playerModule = players.filter(function(module) {
    return module.supportsPlayer(config.player);
  }).shift();

  if (!playerModule) {
    throw new Error("Unknown player: " + config.player);
  }

  logger.debug("Using " + playerModule.name + " for player: " + config.player);

  return playerModule;
}
