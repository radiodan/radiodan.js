'use strict';

var mpd     = require('mpd'),
    EventEmitter = require('events').EventEmitter,
    utils = require('radiodan-client').utils;

exports.create = function (config, logger) {
  config = config || {};

  var ready       = utils.promise.defer(),
      id          = config.id,
      port        = config.port,
      updateCount = 0,
      client;

  logger = logger || utils.logger(__filename);

  function connect(mpdClient) {
    client = mpdClient || mpd.connect({
      port: port, host: 'localhost'
    });

    client.on('ready', function() {
      logger.info('ready on port '+port);
      ready.resolve(instance);
    });

    client.on('error', function(err) {
      var errMsg = 'Cannot connect to port '+port+': '+err;

      instance.emit('error', err);
      ready.reject(err);
    });

    client.on('system', function(eventName) {
      // Rename mpd events
      switch (eventName) {
        case 'mixer':   eventName = 'volume';
                        break;
        case 'options': eventName = 'player';
                        break;
        case 'update':
          updateCount++;

          if(updateCount % 2 == 1) {
            eventName = 'database.update.start';
          } else {
            eventName = 'database.update.end';
          }
          break;
      }

      instance.emit('event', eventName);
    });

    instance.on('error', function(err) {
      logger.warn(err);
    });

    return ready.promise;
  }

  function formatResponse(response, asArray) {
    var formatted;

    if(asArray === true) {
      formatted = [];
    } else {
      formatted = {};
      asArray = false;
    }

    response.split("\n").forEach(function(line) {
      var matches = line.match(/([^:]+): (.*)/);

      if(matches === null) {
        return;
      }

      if(asArray) {
        formatted.push([matches[1], matches[2]]);
      } else {
        formatted[matches[1]] = matches[2];
      }
    });

    return formatted;
  }

  function formatCommand(commandArgs) {
    var command = commandArgs.slice();
    return mpd.cmd(command.shift(), command);
  }

  function sendCommands(commands) {
    logger.debug('sending commands', commands);

    var commandList = commands.map(formatCommand),
        promise     = instance.ready().then(function() {
          return utils.promise.ninvoke(client, 'sendCommands', commandList);
        }).then(null, utils.failedPromiseHandler(logger));

    return promise;
  }

  var instance = new EventEmitter();

  instance.formatResponse = formatResponse;
  instance.formatCommand  = formatCommand;
  instance.sendCommands   = sendCommands;
  instance.connect        = connect;
  instance.id             = id;
  instance.config         = config;
  instance.ready          = function() { return ready.promise; };

  return instance;
};
