var mkdirp   = require('mkdirp'),
    path     = require('path'),
    utils    = require('radiodan-client').utils,
    pathKeys = ['music', 'playlist'],
    fileKeys = ['log', 'db'],
    logger;

module.exports = function (config, configPath) {
  logger = logger || utils.logger(__filename);

  fileKeys.forEach(function(pathKey) {
    makePath(path.dirname(config[pathKey]));
  });

  pathKeys.forEach(function (pathKey) {
    var resolvedPath = resolvePath(config[pathKey], configPath);
    makePath(resolvedPath);
    config[pathKey] = resolvedPath;
  });
}

function resolvePath(relativePath, configPath) {
  var fullPath, configDir;

  if(configPath) {
    configDir = path.dirname(configPath);
    fullPath = path.resolve(configDir, relativePath);
  } else {
    fullPath = relativePath;
  }

  return fullPath;
}

function makePath(fullPath) {
  var dir = path.resolve(fullPath);

  if(dir === '.') {
    return false;
  }

  logger.debug("Creating path", dir);
  return mkdirp.sync(dir);
}
