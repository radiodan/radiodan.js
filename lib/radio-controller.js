var deepEqual = require('deep-equal'),
    action    = require('./action'),
    state     = require('./state'),
    utils     = require('radiodan-client').utils,
    defaultLogger = utils.logger(__filename);

exports.create = function (radio, messagingClient, logger) {
  logger = logger || defaultLogger;

  radio.ready()
        .then(listenForEvents)
        .then(listenForCommands)
        .then(null, utils.failedPromiseHandler(logger));

  function listenForEvents() {
    var cachedResponse = {};

    function isNewData(eventName, data) {
      if(deepEqual(cachedResponse[eventName], data)) {
        logger.warn(eventName, "Not emitting, data is the same");
        return false;
      } else {
        cachedResponse[eventName] = data;
        return true;
      }
    }

    radio.on('event', function(eventName) {
      logger.info(eventName);

      switch(eventName) {
        case 'player':
          //the player has been started, stopped or seeked
          state.invoke(radio, 'status').then(function(status) {
            if(isNewData(eventName, status)) {
              return messagingClient.sendToExchange('radiodan', topicKey('player'), status);
            }
          });
          break;
        case 'playlist':
          //the current playlist has been modified
          state.invoke(radio, 'playlist').then(function(playlist) {
            if(isNewData(eventName, playlist)) {
              return messagingClient.sendToExchange('radiodan', topicKey('playlist'), playlist);
            }
          }).then(null, utils.failedPromiseHandler(logger));
          break;
        case 'mixer':
          //the volume has been changed
          break;
        case 'database':
          //the song database has been modified
          break;
        default:
          logger.warn('Not listening for event '+eventName);
      }
    });
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

    logger.info('command', command);

    return action.invoke(radio, command.action, command).then(
        function() {
          logger.info("Command "+command.action+" completed");
          return replyToCommand(data, false);
        },
        function(error) {
          logger.info("Command "+command.action+" failed");
          return replyToCommand(data, error.toString());
        });
  }

  function replyToCommand(data, error) {
    var replyToQueue = data.properties.replyTo;
    logger.info("Replying to", replyToQueue);

    data.ack();

    return messagingClient.sendToQueue(replyToQueue,
        {correlationId: data.content.correlationId, error: error});
  }

  function topicKey(topic) {
    return 'radio.' + radio.id + '.' + topic;
  }
}
