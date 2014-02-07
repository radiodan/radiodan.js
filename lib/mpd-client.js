var mpd     = require('mpd'),
    EventEmitter = require('events').EventEmitter,
    utils = require('radiodan-client').utils;

exports.create = function (port, logger) {
  var client;

  var logger = logger || utils.logger(__filename);
  var ready = utils.promise.defer();

  function connect(mpdClient) {
    client = mpdClient || mpd.connect({
      port: port, host: 'localhost'
    });

    client.on('ready', function() {
      logger.info('ready on port '+port);
      ready.resolve();
    });

    client.on('error', function(err) {
      var errMsg = 'Cannot connect to port '+port+': '+err;

      instance.emit('error', err);
      ready.reject(err);
    });

    client.on('system', function(name) {
      instance.emit('event', name);
    });

    instance.on('error', function(err) {
      logger.warn(err);
    });

    return ready.promise;
  }

  function formatResponse(response) {
    var formatted = {};

    response.split("\n").forEach(function(line) {
      var matches = line.match(/^(.*): (.*)$/);
      if(matches) {
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
          return utils.promise.ninvoke(client, 'sendCommands', commandList)
        }).then(null, utils.failedPromiseHandler(logger));

    return promise;
  }

  var instance = new EventEmitter();
  instance.formatResponse = formatResponse;
  instance.formatCommand = formatCommand;
  instance.sendCommands = sendCommands;
  instance.connect = connect;
  instance.ready = function() { return ready.promise} ;

  return instance;
};
