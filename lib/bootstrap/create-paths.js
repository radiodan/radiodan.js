var mkdirp   = require('mkdirp'),
    path     = require('path'),
    utils    = require('radiodan-client').utils,
    pathKeys = ['music', 'playlist'],
    fileKeys = ['log', 'db'],
    logger;

module.exports = function (config) {
  logger = logger || utils.logger(__filename);

  fileKeys.map(function(pathKey) {
    makePath(path.dirname(config[pathKey]));
  });

  pathKeys.map(function (pathKey) {
    makePath(config[pathKey]);
  });
}

function makePath(fullPath) {
  var dir = path.resolve(fullPath);

  if(dir === '.') {
    return false;
  }

  logger.debug("Creating path", dir);
  return mkdirp.sync(dir);
}
