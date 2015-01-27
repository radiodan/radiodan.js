'use strict';

var utils           = require('radiodan-client').utils,
    MessagingClient = require('radiodan-client').MessagingClient,
    topicKey        = 'command.discovery.player',
    logger;

exports.create = function(radios, messagingClient) {
  var radioInfo = radios.map(extractDiscoveryFromRadio),
      response;

  messagingClient = messagingClient || MessagingClient.create();
  response        = respondToCommand(radioInfo, messagingClient);

  logger = utils.logger(__filename);

  listenForCommands(response, messagingClient);
};

function extractDiscoveryFromRadio(radio) {
  var info = {
    name: radio.config.name,
    id:   radio.config.id
  };

  return info;
}

function respondToCommand(response, messagingClient) {
  return function (data) {
    var replyToQueue = data.properties.replyTo,
        message = {
          correlationId: data.content.correlationId,
          error: false
        };

    if(replyToQueue) {
      message.response = response;

      logger.info("Replying to", replyToQueue);
      logger.debug("Message for "+replyToQueue, message);

      return messagingClient.sendToQueue(replyToQueue, message);
    } else {
      var errMsg = "No replyTo in message, cannot reply";
      logger.warn(errMsg);
      logger.info(message);
    }

    data.ack();
  };
}

function listenForCommands(response, messagingClient) {
  return messagingClient.createAndBindToExchange({
    exchangeName: 'radiodan',
    topicsKey: topicKey
  }).then(function() {
    logger.info('Registered: ', topicKey);

    messagingClient.on(topicKey, response);
  }, utils.failedPromiseHandler(logger));
}
