var Q       = require('q'),
    mpd     = require('mpd'),
    EventEmitter = require('events').EventEmitter,
    defaultLogger = require('./utils').logger(__filename);

exports.create = function (port, logger) {
  var client;

  var logger = logger || defaultLogger;
  var ready = Q.defer();

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
      instance.emit('system', name);
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
          return Q.ninvoke(client, 'sendCommands', commandList)
        });

    return promise;
  }

  function status() {
    return sendCommands([['status']]).then(function(status) {
      return Q.resolve(formatResponse(status));
    });
  }

  var instance = new EventEmitter();
  instance.formatResponse = formatResponse;
  instance.formatCommand = formatCommand;
  instance.sendCommands = sendCommands;
  instance.status = status;
  instance.connect = connect;
  instance.ready = function() { return ready.promise} ;

  return instance;
};
