var Q       = require('q'),
    actions = require('./actions'),
    utils   = require('./utils'),
    defaultLogger = utils.logger(__filename);

exports.create = function (radio, messagingClient, logger) {
  var commandTopicKey = 'radio.' + radio.id + '.command',
      logger = logger || defaultLogger;

  radio.ready()
        .then(listenForCommands, utils.failedPromiseHandler(logger));

  function listenForCommands() {
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

    return invokeAction(command.action, command).then(
        function() {
          logger.info("Command "+command.action+" completed");
          return replyToCommand(data, false);
        },
        function(error) {
          logger.info("Command "+command.action+" failed");
          return replyToCommand(data, error.toString());
        });
  }

  function invokeAction(actionName, options) {
    options = options || {};

    var action = actions[actionName];

    if(action) {
      return action(radio, options);
    } else {
      var error = new Error("Don't know what to do with" + actionName);
      return Q.reject(error);
    }
  }

  function replyToCommand(data, error) {
    var replyToQueue = data.properties.replyTo;
    logger.info("Replying to", replyToQueue);

    data.ack();

    return messagingClient.sendToQueue(replyToQueue,
        {correlationId: data.content.correlationId, error: error});
  }
}
