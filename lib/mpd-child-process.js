var Q = require('q'),
    winston = require('winston'),
    childProcess = require('child_process');

function processPath(exec) {
  var exec = exec ||  Q.denodeify(childProcess.exec);
  var deferred = Q.defer();

  function handleDone(stdout, stderr) {
    var location = stdout[0].trim().replace(/\n$/, '');
    deferred.resolve(location);
  }

  function handleError(error) {
    deferred.reject(error);
  }

  exec('command -v mpd').done(handleDone, handleError);

  return deferred.promise;
}

function create(configFilepath, spawn, logger) {
  var spawn = spawn || childProcess.spawn;
  var logger = logger || winston;
  var dfd = Q.defer();

  this.processPath().then(function (path) {
    var mpdProcess = spawn(path, [configFilepath, '--no-daemon']);

    mpdProcess.stdout.on('data', function (data) {
      logger.info('MPD: ' + data);
      dfd.resolve();
    });

    mpdProcess.stderr.on('data', function(data) {
      logger.warn('MPD: ' + data);
      dfd.resolve();
    });

    mpdProcess.on('error', function (error) {
      dfd.reject();
    });

    mpdProcess.on('close', function(code, signal) {
      logger.error('MPD Closed: ' + code);
    });
  }, function(error) { dfd.reject('Could not find MPD binary'+error); });

  return dfd.promise;
}

module.exports = {
  processPath: processPath,
  create: create
};
