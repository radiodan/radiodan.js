var amqp  = require('amqplib'),
    Q     = require('q'),
    utils = require('./utils'),
    EventEmitter = require('events').EventEmitter;

exports.create = function (opts) {
  opts = opts || {};

  var logger            = opts.logger || utils.logger(__filename),
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

  function formatMessage (message) {
    var messageJSON = JSON.stringify(message);
    return new Buffer(messageJSON);
  }

  function sendToExchange(channel, exchangeName, topicKey, message, options, cb) {

    logger.info('published to %s', topicKey, message);
    return channel.publish(exchangeName, topicKey, formatMessage(message), (options || {}), cb);
  }

  instance.sendCommand = function (params) {
    var topicKey = params.topicKey,
        exchangeName = params.exchangeName,
        command = params.command,
        def = Q.defer();

    command.correlationId = utils.uuid();

    waitForChannel.then(function(channel) {
      if(!instance.commandReplyQueue) {
        instance.commandReplyQueue = createDisposableQueue(channel);

        instance.commandReplyQueue.then(function(queue) {
          logger.info('waiting on '+queue.queue);
          channel.consume(queue.queue, createMessageHandler(channel));
        }).then(null, utils.failedPromiseHandler());
      }

      return instance.commandReplyQueue.then(function(queue) {
        logger.info('set queue', queue);
        sendToExchange(channel, exchangeName, topicKey, command, {replyTo: queue.queue}, function() {
          def.resolve();
        });
      });
    }).then(null, utils.failedPromiseHandler());

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
      return Q.all([ createTopicExchange(channel, exchangeName), createDisposableQueue(channel, queueName) ])
        .then(function () {
          channel.bindQueue(queueName, exchangeName, topicsKey);
          channel.consume(queueName, createMessageHandler(channel));
        });
    }).then(null, utils.failedPromiseHandler());
  };

  instance.sendToQueue = function (queueName, message) {
    return waitForChannel.then(function (channel) {
      return channel.sendToQueue(queueName, formatMessage(message));
    }).then(null, utils.failedPromiseHandler());
  };

  return instance;
};
