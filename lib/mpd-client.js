var Q       = require('q'),
    mpd     = require('mpd'),
    EventEmitter = require('events').EventEmitter,
    winston = require('winston');

exports.create = function (port, logger) {
  var client;

  var logger = logger || winston;
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

  function formatCommand(command) {
    if(command.length == 1) {
      command[1] = [];
    }

    return mpd.cmd(command[0], command[1]);
  }

  function sendCommands(commands) {
    var commandList = commands.map(formatCommand),
        promise     = instance.ready().then(function() {
            Q.ninvoke(client, 'sendCommands', commandList)
        });

    return promise;
  }

  var instance = new EventEmitter();
  instance.formatCommand = formatCommand;
  instance.sendCommands = sendCommands;
  instance.connect = connect;
  instance.ready = function() { return ready.promise} ;

  return instance;
};
