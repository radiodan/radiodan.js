var winston = require('winston');

var actions = require('lib/actions');

exports.create = function (radio, messagingClient, logger) {
  var commandTopicKey = 'radio.' + radio.id + '.command',
      logger = logger || winston;

  radio.ready()
        .then(function () {
          messagingClient.createAndBindToExchange({
            queueName: 'radiodan-commands-' + radio.id,
            exchangeName: 'radiodan',
            topicsKey: commandTopicKey
          });

          logger.info('Registered: ', radio.id, 'on: ', commandTopicKey);

          messagingClient.on(commandTopicKey, respondToCommand);
        });

  function respondToCommand(data) {
    var command = data.content;

    logger.info('command', command);
    commandAction = actions[command.action];

    if(commandAction) {
      commandAction(radio, command).then(function() {
        data.ack();
        logger.info("Command "+command.action+" completed");
      });
    } else {
      logger.warn("Don't know what to do with" + command.action, command);
      data.ack();
    }
  }
}
