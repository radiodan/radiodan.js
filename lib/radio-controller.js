var deepEqual = require('deep-equal'),
    action    = require('./action'),
    state     = require('./state'),
    utils     = require('radiodan-client').utils;

exports.create = function (radio, messagingClient, logger) {
  logger = logger || utils.logger(__filename);

  var cachedResponse = {};

  radio.ready()
        .then(listenForEvents)
        .then(listenForCommands)
        .then(null, utils.failedPromiseHandler(logger));

  function isNewData(eventName, data) {
    if(deepEqual(cachedResponse[eventName], data)) {
      logger.warn(eventName, "Not emitting, data is the same");
      return false;
    } else {
      cachedResponse[eventName] = data;
      return true;
    }
  }

  function listenForEvents() {

    radio.on('event', function(eventName) {
      logger.info(eventName);

      // Rename mpd events
      switch (eventName) {
        case 'mixer':   eventName = 'volume';
                        break;
        case 'options': eventName = 'player';
                        break;
      }

      var promise = invokeAndCreateEmitter(eventName);

      promise.then(null, function () {
        logger.warn('Not listening for event '+eventName);
      });
    });
  }

  function invokeAndCreateEmitter(eventName) {
    return state.invoke(radio, eventName)
                .then(createEmitterForState(eventName))
                .then(null, utils.failedPromiseHandler());
  }

  function createEmitterForState(eventName) {
    return function (state) {
      return emitEventForState(eventName, state);
    }
  }

  function emitEventForState(eventName, state) {
    if(isNewData(eventName, state)) {
      return messagingClient.sendToExchange('radiodan', topicKey(eventName), state);
    }
  }

  function listenForCommands() {
    var commandTopicKey = topicKey('command');
    return messagingClient.createAndBindToExchange({
      queueName: 'radiodan-commands-' + radio.id,
      exchangeName: 'radiodan',
      topicsKey: commandTopicKey
    }).then(function() {
      logger.info('Registered: ', radio.id, 'on: ', commandTopicKey);

      messagingClient.on(commandTopicKey, respondToCommand);
    }, utils.failedPromiseHandler(logger));
  }

  function respondToCommand(data) {
    var command = data.content;

    logger.debug('command', command);

    return action.invoke(radio, command.action, command).then(
        function(response) {
          logger.info("Command "+command.action+" completed");
          return replyToCommand(data, false, response);
        },
        function(error) {
          logger.info("Command "+command.action+" failed");
          return replyToCommand(data, error.toString());
        });
  }

  function replyToCommand(data, error, response) {
    var replyToQueue = data.properties.replyTo,
        message = {
          correlationId: data.content.correlationId,
          error: error
        };

    if(response) {
      message.response = response;
    }

    logger.info("Replying to", replyToQueue);
    logger.debug("Message for "+replyToQueue, message);

    data.ack();

    return messagingClient.sendToQueue(replyToQueue,
        {correlationId: data.content.correlationId, error: error});
  }

  function topicKey(topic) {
    return 'radio.' + radio.id + '.' + topic;
  }
}
