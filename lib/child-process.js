var utils = require('radiodan-client').utils,
    childProcess = require('child_process'),
    defaultLogger = utils.logger(__filename);

module.exports = {
  create: create, processPath: processPath, spawnProcess: spawnProcess
};

function create(execCommand, params) {
  return processPath(execCommand)
    .then(
      function(path) { return spawnProcess(path, params) }
    )
    .then(null, utils.failedPromiseHandler(defaultLogger));
};

function processPath(cmd, exec) {
  exec = exec || utils.promise.denodeify(childProcess.exec);

  return exec('command -v '+cmd)
    .then(function(stdout, stderr) {
      var path = stdout[0].trim().replace(/\n$/, '');
      return utils.promise.resolve(path);
    });
}

function spawnProcess(path, params, spawn, logger) {
  var dfd = utils.promise.defer(),
      child;

  logger = logger || defaultLogger;
  spawn  = spawn || childProcess.spawn;
  child  = spawn(path, params);

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
      child.kill('SIGKILL');
    } catch (e) {
      logger.error(e.stack);
    }
  });

  return dfd.promise;
}
