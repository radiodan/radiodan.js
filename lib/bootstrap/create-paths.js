var mkdirp   = require('mkdirp'),
    path     = require('path'),
    utils    = require('radiodan-client').utils,
    pathKeys = ['music', 'playlist'],
    fileKeys = ['log', 'db'],
    logger;

module.exports = function (config, configPath, newPath, newMkdir) {
  config = config || {};
  logger = logger || utils.logger(__filename);

  //this is mostly stubbing for testing purposes
  overwriteDefaults(newPath, newMkdir);

  fileKeys.forEach(function(pathKey) {
    if(config.hasOwnProperty(pathKey)) {
      makePath(path.dirname(config[pathKey]));
    }
  });

  pathKeys.forEach(function (pathKey) {
    if(config.hasOwnProperty(pathKey)) {
      var resolvedPath = resolvePath(config[pathKey], configPath);
      makePath(resolvedPath);
      config[pathKey] = resolvedPath;
    }
  });
}

function resolvePath(relativePath, configPath) {
  var fullPath, configDir;

  if(typeof relativePath === 'undefined') {
    throw new Error('No Path given');
  }

  if(configPath) {
    configDir = path.dirname(configPath);
    fullPath = path.resolve(configDir, relativePath);
  } else {
    fullPath = relativePath;
  }

  return fullPath;
}

function makePath(fullPath) {
  var dir;

  if(typeof fullPath === 'undefined') {
    throw new Error('No Path given');
  }

  dir = path.resolve(fullPath);

  if(dir === '.' || typeof dir === 'undefined') {
    return false;
  }

  logger.debug('Creating path', dir);
  return mkdirp.sync(dir);
}

function overwriteDefaults(newPath, newMkdir) {
  if(newPath) {
    path = newPath;
  }

  if(newMkdir) {
    mkdirp = newMkdir;
  }
}
