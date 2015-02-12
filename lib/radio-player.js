'use strict';

var utils           = require('radiodan-client').utils,
    MessagingClient = require('radiodan-client').MessagingClient,
    Player          = require('./player'),
    radioController = require('./radio-controller'),
    logger;

exports.create = function(config, logger) {
  logger = logger || utils.logger(__filename);

  return Player.create(config).start()
    .then(bindToController)
    .then(null, utils.failedPromiseHandler(logger));
};

function bindToController(player) {
  var messagingClient = MessagingClient.create();
  radioController.create(player, messagingClient);

  return player;
}
