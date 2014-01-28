var winston = require('winston');

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

          messagingClient.on(commandTopicKey, doSomething);
        });

  function doSomething(data) {
    var command = data.content,
        commandPromise;

    logger.info('command', command);
    switch(command.action) {
      case 'random':
        commandPromise = radio.sendCommands([
          ['clear'], ['add', ['iTunes']], ['random', ['1']], ['play']
        ]);
        break;
      case 'volume':
        if(command.hasOwnProperty('value')) {
          var absoluteVol = parseInt(command.value);

          if(absoluteVol < 0) {
            absoluteVol = 0;
          } else if(absoluteVol > 100) {
            absoluteVol = 100;
          }

          commandPromise = radio.sendCommands([
            ['setvol', [absoluteVol]]
          ]);
          break;
        } else if(command.hasOwnProperty('diff')) {
          commandPromise = radio.sendCommands(['status'])
            .then(function(statusString) {
              var volume = statusString.match(/volume: (\d{1,3})^/)
              var newVol = parseInt(volume)+parseInt(command.diff);

              return sendCommands([['setlvol', [newVol]]]);
            });
          break;
        }
      default:
        logger.warn("Don't know what to do with" + command.player, command);
        data.ack();
    }

    if(commandPromise) {
      commandPromise.then(function() {
        data.ack();
        logger.info("Command "+command.action+" completed");
      });
    }

  }
}
