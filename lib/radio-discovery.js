var utils           = require('radiodan-client').utils,
    MessagingClient = require('radiodan-client').MessagingClient,
    messagingClient = MessagingClient.create(),
    topicKey        = 'command.discovery.player',
    logger;

exports.create = function(radios) {
  var radioInfo = radios.map(extractDiscoveryFromRadio),
      response  = respondToCommand(radioInfo);

  logger = utils.logger(__filename);

  listenForCommands(response);
}

function extractDiscoveryFromRadio(radio) {
  var info = {
    name: radio.config.name,
    id:   radio.config.id
  };

  return info;
}

function respondToCommand(response) {
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
  }
}

function listenForCommands(response) {
  return messagingClient.createAndBindToExchange({
    exchangeName: 'radiodan',
    topicsKey: topicKey
  }).then(function() {
    logger.info('Registered: ', topicKey);

    messagingClient.on(topicKey, response);
  }, utils.failedPromiseHandler(logger));
}
