var Mustache = require('mustache'),
    fs       = require('fs'),
    Q        = require('q'),
    winston  = require('winston'),
    tmp      = require('tmp');

var templatePath = __dirname + '/../templates/mpd.conf.mustache';
var template = fs.readFileSync(templatePath, 'utf8');
var firstMPDPort = 6600;

exports.resetPortNumber = function() {
  return firstMPDPort = 6600;
};

exports.create = function(logger) {
  var instance = {},
      generateFileName,
      logger = logger || winston;

  instance.port = firstMPDPort++;

  instance.build = function(config) {
    //assign generated port to current config
    config.port = instance.port;

    return Mustache.render(template, config);
  };

  instance.fileName = function() {
    if(!generateFileName) {
      generateFileName = Q.nfcall(tmp.tmpName);
    }

    return generateFileName;
  };

  instance.writeToDisk = function(tempFilePath, configFile) {
    logger.info("Created temporary filename: ", tempFilePath);
    return Q.nfcall(fs.writeFile, tempFilePath, configFile);
  };

  instance.write = function(config) {
    var configFile = this.build(config);

    return instance.fileName().then(function(tempFilePath) {
      return instance.writeToDisk(tempFilePath, configFile);
    }).then(instance.fileName);
  };

  return instance;
};
