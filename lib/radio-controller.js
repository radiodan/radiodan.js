exports.create = function (radio, messagingClient) {
  var commandTopicKey = 'radio.' + radio.id + '.command';
  radio.ready()
        .then(function () {
          messagingClient.createAndBindToExchange({
            queueName: 'commands',
            exchangeName: 'radiodan',
            topicsKey: commandTopicKey
          });

          console.log('Registered: ', radio.id, 'on: ', commandTopicKey);

          messagingClient.on(commandTopicKey, doSomething);
        });

  function doSomething(data) {
    var command = data.content;
    console.log('command', command);
    switch(command.action) {
      case 'random':
        radio.sendCommands([
          ['clear'], ['add', ['iTunes']], ['random', ['1']], ['play']
        ]).then(function() { console.log("Played Randomly")});
        break;
      default:
        console.log("Don't know what to do with" + command.player);
    }

    data.ack();
  }
}
