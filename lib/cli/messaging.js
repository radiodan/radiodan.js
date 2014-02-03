var amqp     = require('amqplib'),
    Q        = require('q'),
    messagingClient = require('../messaging-client'),
    utils    = require('../utils');

exports.create = function (id, queueHost) {
  var client = messagingClient.create({host: queueHost}),
      instance = {};

  var waitForExchange = client.createExchange({exchangeName: 'radiodan'});

  instance.id = 'radio.' + id + '.command';
  instance.sendCommand = function(command, done) {
    waitForExchange.then(function() {
      client.sendCommand({
        exchangeName: 'radiodan', topicKey: instance.id, command: command
      }).then(done);
    });
  };

  return instance;
}
