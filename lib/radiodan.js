var utils           = require('radiodan-client').utils,
    MessagingClient = require('radiodan-client').MessagingClient,
    mpdProcess      = require('./mpd/mpd-process'),
    mpdClient       = require('./mpd/mpd-client'),
    radioController = require('./radio-controller'),
    logger;

function spawnMPDProcess(config) {
  function addPortToConfig(port) {
    config.port = port;
    return config;
  }

  return mpdProcess.create(config).start().then(addPortToConfig);
}

function createMPDClient(config) {
  var client = mpdClient.create(config.port);
  client.id = config.id;

  return client.connect();
}

function bindControllerToClient(client) {
  var messagingClient = MessagingClient.create();
  radioController.create(client, messagingClient);

  return client;
}

exports.create = function(config, logger) {
  logger = logger || utils.logger(__filename);

  return spawnMPDProcess(config)
    .then(createMPDClient)
    .then(bindControllerToClient)
    .then(null, utils.failedPromiseHandler(logger));
}
