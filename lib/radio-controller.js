var actions = require('./actions'),
    utils   = require('./utils'),
    defaultLogger = utils.logger(__filename);

exports.create = function (radio, messagingClient, logger) {
  var commandTopicKey = 'radio.' + radio.id + '.command',
      logger = logger || defaultLogger;

  radio.ready()
        .then(function () {
          messagingClient.createAndBindToExchange({
            queueName: 'radiodan-commands-' + radio.id,
            exchangeName: 'radiodan',
            topicsKey: commandTopicKey
          });

          logger.info('Registered: ', radio.id, 'on: ', commandTopicKey);

          messagingClient.on(commandTopicKey, respondToCommand);
        }, utils.failedPromiseHandler(logger));

  function respondToCommand(data) {
    var command = data.content,
        replyToQueue = data.properties.replyTo;

    logger.info('command', command);
    commandAction = actions[command.action];

    if(commandAction) {
      commandAction(radio, command).then(function() {
        logger.debug('data', data);
        data.ack();
        logger.info("Command "+command.action+" completed");
        logger.info("Replying to ", replyToQueue);
        return messagingClient.sendToQueue(replyToQueue,
          {correlationId: command.correlationId, error: false});
      }, failedCommand);
    } else {
      var error = new Error("Don't know what to do with" + command.action);
      return failedCommand(error);
    }

    function failedCommand(error) {
      logger.error('command failed', error);
      data.ack();
      return messagingClient.sendToQueue(replyToQueue,
          {correlationId: command.correlationId, error: error.toString()});
    }
  }
}
