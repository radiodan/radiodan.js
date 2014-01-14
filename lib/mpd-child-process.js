var Q = require('Q'),
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

  exec('which mpd').done(handleDone, handleError);

  return deferred.promise;
}

function create(configFilepath, spawn) {
  var spawn = spawn || childProcess.spawn;
  var dfd = Q.defer();

  this.processPath().then(function (path) {
    var mpdProcess = spawn(path, [configFilepath, '--no-daemon']);

    mpdProcess.stdout.on('data', function (data) {
      dfd.resolve();
    });

    mpdProcess.on('error', function (error) {
      dfd.reject();
    });
  }, function() { dfd.reject('Could not find MPD binary'); });

  return dfd.promise;
}

module.exports = {
  processPath: processPath,
  create: create
};
