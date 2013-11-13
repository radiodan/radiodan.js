var Q      = require('q'),
    mpd    = require('mpd'),
    _      = require('lodash'),
    logger = require('winston');

exports.create = function (config, port) {
  var mpdCommand = require('./mpd-command.js')(sendCommand);
  var instance = {},
      ready,
      client;

  function reportError() {
    console.error(config.name , arguments);
  }

  function connect() {
    var deferred = Q.defer();

    client = mpd.connect({
      port: port, host: 'localhost'
    });

    client.on('ready', function() {
      logger.info(config.name+' ready on port '+port);
      deferred.resolve();
    });

    return deferred.promise;
  }

  function sendCommands(commands) {
    function appendCommand(command) {
      var thisCommand = mpdCommand(command[0], command[1]);

      if(thisCommand.valid()) {
        return thisCommand.params().join(' ');
      }
    }

    var commandList = commands.map(appendCommand);
    var invalid = _.any(commandList, function(c) { return _.isUndefined(c) });

    if(invalid) {
      var deferred = Q.defer();
      deferred.reject('invalid commands');
    } else {
      console.log(commandList);
      var deferred = Q.ninvoke(client, 'sendCommands', commandList);
    }

    return deferred.promise;
  }

  function sendCommand(command, params) {
    params = (typeof params === 'undefined') ? [] : params;

    var mpdCommand = mpd.cmd(command, params);
    var deferred   = Q.ninvoke(client, 'sendCommand', mpdCommand);

    return deferred.promise;
  }

  instance.connect = function(mpdReady) {
    ready = mpdReady.then(connect);
  };

  instance.playAllRandom = function() {
    return ready
      .then(function() { return sendCommands([['add', ['iTunes']], ['random', ['1']], ['play']]); })
      .fail(reportError);
  };

  instance.playAllRandomAsync = function() {
    return ready.then(mpdCommand('add', ['iTunes']))
          .then(mpdCommand('random', ['1']))
          .then(mpdCommand('play'))
          .fail(reportError);
  };

  return instance;
};
