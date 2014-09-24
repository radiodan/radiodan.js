var action       = require('./action'),
    state        = require('./state'),
    stateEmitter = require('./state-emitter'),
    utils        = require('radiodan-client').utils;

exports.create = function (radio, messagingClient, logger) {
  logger = logger || utils.logger(__filename);

  var cachedResponse = {};

  radio.ready()
        .then(listenForEvents)
        .then(listenForCommands)
        .then(null, utils.failedPromiseHandler(logger));

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

      invokeAndCreateEmitter(eventName)
        .then(null, function () {
          logger.debug('Not listening for event '+eventName);
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
      return emitEventsForState(eventName, state);
    }
  }

  function emitEventsForState(eventName, state) {
    //check for any more specific changes to be emitted
    stateEmitter.invoke(eventName, state)
     .then(function(emitEvents) {
       var emitted = emitEvents.map(function(evnt) {
         return messagingClient.sendToExchange(
           'radiodan', eventTopicKey(evnt.eventName), evnt.data
         );
       });

       return utils.promise.all(emitted);
      })
     .then(function() {
       // emit only if state passes emitter's validation
       return messagingClient.sendToExchange(
         'radiodan', eventTopicKey(eventName), state
       );
     })
     .then(null, function(err) {
       logger.warn(err);
     });
  }

  function listenForCommands() {
    var topicKey = commandTopicKey('command');
    return messagingClient.createAndBindToExchange({
      exchangeName: 'radiodan',
      topicsKey: topicKey
    }).then(function() {
      logger.info('Registered: ', radio.id, 'on: ', topicKey);

      messagingClient.on(topicKey, respondToCommand);
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

    return messagingClient.sendToQueue(replyToQueue, message);
  }

  function commandTopicKey() {
    return 'command.player.' + radio.id;
  }

  function eventTopicKey(topic) {
    return 'event.player.' + radio.id + '.' + topic;
  }
}
