var amqp = require('amqplib'),
    Q = require('q'),
    EventEmitter = require('events').EventEmitter,
    utils = require('./utils');

exports.create = function (opts) {
  opts = opts || {};

  var logger            = opts.logger || utils.logger,
      host              = opts.host   || 'localhost',
      instance          = new EventEmitter(),
      waitForConnection = amqp.connect('amqp://' + host),
      waitForChannel;

  waitForChannel = waitForConnection.then(function (connection) {
    return connection.createConfirmChannel();
  }, utils.failedPromiseHandler());

  function createMessageHandler(channel) {
    return function (data) {
      data.acked = false;

      logger.debug('messaging-client: recieved msg', data);

      try {
        data.content = JSON.parse(data.content);
      } catch(err) {
        logger.error('messaging-client: '+err.stack);
        data.content = {};
      }

      data.ack = function () {
        if (!data.acked) {
          var acked = channel.ack(data);
          data.acked = true;
        }
      };
      instance.emit(data.fields.routingKey, data);
      instance.emit('message', data);
    }
  }

  function createTopicExchange(channel, name) {
    return channel.assertExchange(name, 'topic');
  }

  function createDisposableQueue(channel, name) {
    // Queue expires on RabbitMQ restart or consumer disconnects
    return channel.assertQueue(name, {durable: false, autoDelete: true});
  }

  instance.sendCommand = function (params) {
    var topicKey = params.topicKey,
        exchangeName = params.exchangeName,
        command = params.command,
        def = Q.defer(),
        message = JSON.stringify(command);

    waitForChannel.then(function(channel) {
      channel.publish(exchangeName, topicKey, new Buffer(message), {}, function() {
        def.resolve();
      });

      console.log('published to %s', topicKey, message);
    });

    return def.promise;
  };

  instance.createExchange = function (params) {
    var exchangeName = params.exchangeName;

    return waitForChannel.then(function (channel) {
      return createTopicExchange(channel, exchangeName)
    }, utils.failedPromiseHandler());
  };

  instance.createAndBindToExchange = function (params) {
    var queueName    = params.queueName,
        exchangeName = params.exchangeName,
        topicsKey    = params.topicsKey;

    waitForChannel.then(function (channel) {
      Q.all([ createTopicExchange(channel, exchangeName), createDisposableQueue(channel, queueName) ])
        .then(function () {
          channel.bindQueue(queueName, exchangeName, topicsKey);
          channel.consume(queueName, createMessageHandler(channel));
        }, utils.failedPromiseHandler());
    }, utils.failedPromiseHandler());
  };

  return instance;
};
