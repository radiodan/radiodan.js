var Mustache = require('mustache'),
    fs       = require('fs'),
    utils    = require('radiodan-client').utils,
    tmp      = require('tmp'),
    defaultLogger = utils.logger(__filename);

var templatePath = __dirname + '/../templates/mpd.conf.mustache';
var template = fs.readFileSync(templatePath, 'utf8');
var firstMPDPort = 6600;
var firstHTTPPort = 8000;

exports.resetPortNumber = function() {
  firstHTTPPort = 8000;
  firstMPDPort = 6600;
};

exports.create = function(logger) {
  var instance = {},
      generateFileName,
      logger = logger || defaultLogger;

  instance.port = firstMPDPort++;
  instance.httpPort = firstHTTPPort++;

  instance.build = function(config) {
    //assign generated port to current config
    config.port = instance.port;
    config.httpPort = instance.httpPort;
    config[config.platform] = true;
    delete config.platform;

    return Mustache.render(template, config);
  };

  instance.fileName = function() {
    if(!generateFileName) {
      generateFileName = utils.promise.nfcall(tmp.tmpName);
    }

    return generateFileName;
  };

  instance.writeToDisk = function(tempFilePath, configFile) {
    logger.info("Created temporary filename: ", tempFilePath);
    return utils.promise.nfcall(fs.writeFile, tempFilePath, configFile);
  };

  instance.write = function(config) {
    var configFile = this.build(config);

    return instance.fileName().then(function(tempFilePath) {
      return instance.writeToDisk(tempFilePath, configFile);
    }).then(instance.fileName);
  };

  return instance;
};
