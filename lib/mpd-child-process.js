var utils = require('radiodan-client').utils,
    childProcess = require('child_process'),
    defaultLogger = utils.logger(__filename);

function processPath(exec) {
  var exec = exec ||  utils.promise.denodeify(childProcess.exec);
  var deferred = utils.promise.defer();

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
  var logger = logger || defaultLogger;
  var dfd = utils.promise.defer();

  this.processPath().then(function (path) {
    var mpdProcess = spawn(path, [configFilepath, '--no-daemon', '--verbose']);

    mpdProcess.stdout.on('data', function (data) {
      logger.debug(data.toString());
      dfd.resolve();
    });

    mpdProcess.stderr.on('data', function(data) {
      logger.debug(data.toString());
      dfd.resolve();
    });

    mpdProcess.on('error', function (error) {
      dfd.reject();
    });

    mpdProcess.on('close', function(code, signal) {
      logger.error('MPD Closed: ' + code);
    });

    process.on('exit', function () {
      try {
        mpdProcess.kill('SIGINT');
      } catch (e) {
        logger.error(e.stack);
      }
    });
  }, function(error) { dfd.reject('Could not find MPD binary'+error); });

  return dfd.promise;
}

module.exports = {
  processPath: processPath,
  create: create
};
