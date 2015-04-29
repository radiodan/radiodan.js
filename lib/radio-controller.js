'use strict';

var stateEmitter = require('./state-emitter'),
    utils        = require('radiodan-client').utils;

exports.create = function(radio, action, state, messagingClient, logger) {
  logger = logger || utils.logger(__filename);

  var worker, publisher;

  publisher = messagingClient.Publisher.create();

  radio.ready()
        .then(listenForEvents)
        .then(listenForCommands)
        .then(null, utils.failedPromiseHandler(logger));

  function listenForEvents() {
    radio.on('event', function(eventName) {
      logger.info(eventName);

      invokeAndCreateEmitter(eventName)
        .then(null, function () {
          logger.debug('Not listening for event '+eventName);
        });
    });
  }

  function invokeAndCreateEmitter(eventName) {
    return state.invoke(radio, eventName)
                .then(createEmitterForState(eventName))
                .then(null, utils.failedPromiseHandler(logger));
  }

  function createEmitterForState(eventName) {
    return function (state) {
      return emitEventsForState(eventName, state);
    };
  }

  function emitEventsForState(eventName, state) {
    //check for any more specific changes to be emitted
    stateEmitter.invoke(eventName, state)
     .then(function(emitEvents) {
       // emit only if state passes emitter's validation
       //
       emitEvents.forEach(function(evnt) {
         publisher.publish(eventTopicKey(evnt.eventName), evnt.data);
       });

       publisher.publish(eventTopicKey(eventName), state);
     })
     .then(null, function(err) {
       logger.warn(err);
     });
  }

  function listenForCommands() {
    worker = messagingClient.Worker.create('radiodan-player-'+radio.id);

    worker.addService({
      serviceType: 'player', serviceInstances: [radio.id]
    });

    worker.ready();
    worker.events.on('request', respondToCommand);

    logger.info('Registered Worker: player.' + radio.id);
    return utils.promise.resolve();
  }

  function respondToCommand(req) {
    var message = { error: false };

    logger.debug('req', req);

    return action.invoke(radio, req.command, req.params).then(
        function(response) {
          logger.info("Command "+req.command+" completed");

          message.response = response;
          worker.respond(req.sender, req.correlationId, message);
          utils.promise.resolve(response);
        },
        function(error) {
          logger.info("Command "+req.command+" failed");

          message.error = error;
          worker.respond(req.sender, req.correlationId, message);
          utils.promise.reject(error);
        });
  }

  function eventTopicKey(topic) {
    return 'event.player.' + radio.id + '.' + topic;
  }
};
