var amqp     = require('amqplib'),
    Q        = require('q'),
    messagingClient = require('../messaging-client'),
    utils    = require('../utils');

exports.create = function (id, queueHost) {
  var connectionPromise = connect(amqp.connect('amqp://' + queueHost)),
      instance = {};

  queueHost = queueHost || 'localhost';

  instance.id = 'radio.' + id + '.command';
  instance.sendCommand = function(command, done) {
    return sendCommand(command, instance.id, connectionPromise, done);
  };

  return instance;
}

/*
  Connect to message queue
*/
function connect(waitForConnection) {
  var deferred = Q.defer();

  waitForConnection.then(function (connection) {
    var waitForChannel = connection.createConfirmChannel();

    waitForChannel.then(function (ch) {
      channel = ch;
      var waitForExchange = channel.assertExchange('radiodan', 'topic');
      waitForExchange.then(function () {
        deferred.resolve(channel);
      }, utils.failedPromiseHandler);
    }, utils.failedPromiseHandler);
  }, utils.failedPromiseHandler);

  return deferred.promise;
}

/*
  Send a command to Rabbit MQ
*/
function sendCommand(command, radioId, connectionPromise, done) {
  command = JSON.stringify(command);
  connectionPromise.then(function (channel) {
    channel.publish('radiodan', radioId, new Buffer(command), {}, done);
    console.log('published to %s', topicForId(radioId), command);
  });
}

