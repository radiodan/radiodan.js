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

  function enqueue(filePath) {
    filePath = typeof filePath !== 'undefined' ? filePath : '';
    return sendCommand('add',[filePath]);
  }

  function setRandom() {
    return sendCommand('random', ['1']);
  }

  function removeRandom() {
    return sendCommand('random', ['0']);
  }

  function play() {
    return sendCommand('play', []);
  }

  function sendCommand(command, params) {
    var deferred = Q.defer(),
        mpdCommand = mpd.cmd(command, params);

    client.sendCommand(mpdCommand, function(err, msg) {
      if(err) {
        deferred.reject(err);
      } else {
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
      .then(enqueue)
      .then(setRandom)
      .then(play)
      .fail(reportError);
  };

  return instance;
};
