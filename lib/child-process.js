var utils = require('radiodan-client').utils,
    childProcess = require('child_process');

module.exports.create = function(execCommand, params) {
  var dfd    = utils.promise.defer();

  processPath(execCommand)
    .then(spawnProcess, function(err) { return dfd.reject(err) })
    .then(null, utils.failedPromiseHandler(logger));

  return dfd.promise;

  function processPath(cmd) {
    var exec = utils.promise.denodeify(childProcess.exec);
    var deferred = utils.promise.defer();

    function handleDone(stdout, stderr) {
      var location = stdout[0].trim().replace(/\n$/, '');
      deferred.resolve(location);
    }

    function handleError(error) {
      deferred.reject(error);
    }

    exec('command -v '+cmd).done(handleDone, handleError);

    return deferred.promise;
  }

  function spawnProcess(path) {
    var logger = utils.logger(__filename),
        child;

    child = childProcess.spawn(path, params);

    child.stdout.on('data', function (data) {
      logger.debug(data.toString());
      dfd.resolve();
    });

    child.stderr.on('data', function(data) {
      logger.debug(data.toString());
      dfd.resolve();
    });

    child.on('error', function (error) {
      dfd.reject();
    });

    child.on('close', function(code, signal) {
      logger.error('Closed', code, signal);
    });

    process.on('exit', function () {
      try {
        child.kill('SIGINT');
      } catch (e) {
        logger.error(e.stack);
      }
    });
  }
};
