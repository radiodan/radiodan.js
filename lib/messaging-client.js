var amqp = require('amqplib'),
    logger = require('winston'),
    Q = require('q'),
    EventEmitter = require('events').EventEmitter;

function error(err) {
  console.error(err);
}

exports.create = function () {
  var instance          = new EventEmitter(),
      waitForConnection = amqp.connect('amqp://localhost'),
      waitForChannel;

  waitForChannel = waitForConnection.then(function (connection) {
    return connection.createChannel();
  }, error);

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

  instance.createAndBindToExchange = function (params) {
    var queueName    = params.queueName,
        exchangeName = params.exchangeName,
        topicsKey    = params.topicsKey;

    waitForChannel.then(function (channel) {
      var waitForExchange = channel.assertExchange(exchangeName, 'topic');
      // Queue expires on RabbitMQ restart or consumer disconnects
      var waitForQueue    = channel.assertQueue(queueName, {durable: false, autoDelete: true});
      var waitForBind     = Q.all([waitForExchange, waitForQueue]).then(function () {
        channel.bindQueue(queueName, exchangeName, topicsKey);
        channel.consume(queueName, createMessageHandler(channel));
      }, error);
    }, error);
  };

  return instance;
};
