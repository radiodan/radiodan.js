var Q      = require('q'),
    mpd    = require('mpd'),
    logger = require('winston');

exports.create = function (config, port) {
  var instance = {},
      ready,
      client;

  function reportError() {
    logger.error(config.name, arguments);
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

  function wrapCommand(command, defaults) {
    defaults = defaults || [];

    var executable = function(args) {
      return sendCommand.apply(null, executable.params(args));
    };

    executable.params = function(args) {
      args = args || defaults;
      return [command, args];
    };

    return executable;
  }

  enqueue       = wrapCommand('add', ['iTunes']);
  setRandom     = wrapCommand('random', ['1']);
  removeRandom  = wrapCommand('random', ['0']);
  play          = wrapCommand('play', ['1']);

  function sendCommands(commands) {
    var deferred = Q.defer();

    function appendPromise(promise) {
      return promise.params().join(' ');
    }

    var commandList = commands.map(appendPromise);
    console.log(commandList);

    client.sendCommands(commandList, function(err, msg){
      if(err) {
        console.log('multicommand '+err);
        deferred.reject(err);
      } else {
        deferred.resolve(msg);
      }
    });

    return deferred.promise;
  }

  function sendCommand(command, params) {
    params = (typeof params === 'undefined') ? [] : params;

    var deferred = Q.defer(),
        mpdCommand = mpd.cmd(command, params);


    console.log('sendCommand', command, params);

    client.sendCommand(mpdCommand, function(err, msg) {
      if(err) {
        console.log(command+' '+err);
        deferred.reject(command+' '+err);
      } else {
        console.log(command+' YAY');
        deferred.resolve(msg);
      }
    });

    return deferred.promise;
  }

  instance.play = play;

  instance.connect = function(mpdReady) {
    ready = mpdReady.then(connect);
  };

  instance.playAllRandom = function() {
    return ready
      .then(function() { sendCommands([enqueue, setRandom, play]); })
      .fail(reportError);
  };

  instance.playThing = function() {
    return ready.then(enqueue).then(function() { play([3]) });
  }

  return instance;
};
