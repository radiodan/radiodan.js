'use strict';

var Audio  = require('./system/audio'),
    utils  = require('radiodan-client').utils,
    logger = utils.logger();

module.exports.create = function(messagingClient) {
  var serviceType = 'audio',
      serviceInstance = 'default',
      serviceName = serviceType + '.' + serviceInstance,
      publisher = messagingClient.Publisher.create(),
      worker = messagingClient.Worker.create('audio'),
      audio = Audio.create();

  worker.addService({
    serviceType: serviceType, serviceInstances: [serviceInstance]
  });

  worker.ready();

  worker.events.on(serviceName, function(req) {
    var sender = req.sender,
        correlationId = req.correlationId,
        action = req.command;

    switch(action) {
      case 'volume':
        audio.setVolume(req.params).then(response, error)
          .then(null, utils.failedPromiseHandler(logger));
        break;
      case 'status':
        audio.status().then(response, error).then(publish)
          .then(null, utils.failedPromiseHandler(logger));
        break;
      default:
        logger.error('Unknown action', action);
    }

    function response(res) {
      var vol = parseInt(res),
          msg = { response: { volume: vol } };

      worker.respond(sender, correlationId, msg);

      return vol;
    }

    function error(err) {
      var msg = { error: err.toString() };

      worker.respond(sender, correlationId, msg);
    }

    function publish(vol) {
      var msg = {value: vol};

      publisher.publish(serviceName, msg);
    }
  });
};
