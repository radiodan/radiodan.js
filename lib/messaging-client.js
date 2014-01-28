var amqp = require('amqplib'),
    Q = require('q'),
    EventEmitter = require('events').EventEmitter,
    utils = require('./utils');

exports.create = function () {
  var instance          = new EventEmitter(),
      waitForConnection = amqp.connect('amqp://localhost'),
      waitForChannel;

  waitForChannel = waitForConnection.then(function (connection) {
    return connection.createChannel();
  }, utils.failedPromiseHandler());

  console.log('waitForChannel', waitForChannel);

  function createMessageHandler(channel) {
    return function (data) {
      data.acked = false;
      data.content = JSON.parse(data.content);
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
