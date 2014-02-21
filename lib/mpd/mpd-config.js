var Mustache   = require('mustache'),
    fs         = require('fs'),
    portfinder = require('portfinder'),
    tmp        = require('tmp'),
    utils      = require('radiodan-client').utils;

portfinder.basePort = 6600;

var templatePath = __dirname + '/../../templates/mpd.conf.mustache';
var template = fs.readFileSync(templatePath, 'utf8');

exports.create = function(logger) {
  var instance = {},
      generateFileName,
      logger = logger || utils.logger(__filename);

  instance.build    = build;
  instance.fileName = fileName;

  instance.write = function(config) {
    return findOpenPorts()
          .then(function(ports) {
            return writeConfigToDisk(config, ports)
          });
  };

  return instance;

  function writeConfigToDisk(config, ports) {
    var mpdConfig  = utils.promise.resolve(build(config, ports)),
        configFile = fileName();

    var written = utils.promise.spread(
        [configFile, mpdConfig], writeToDisk
    );

    return written
      .then(fileName)
      .then(function(filePath) { return [filePath, ports[0]] });
  }

  function build(config, ports) {
    ports = ports || [];

    //assign generated port to current config
    config.port = ports[0];
    config.httpPort = ports[1];
    config[config.platform] = true;
    delete config.platform;

    return Mustache.render(template, config);
  };

  function fileName() {
    if(!generateFileName) {
      generateFileName = utils.promise.nfcall(tmp.tmpName);
    }

    return generateFileName;
  };

  function writeToDisk(tempFilePath, configFile) {
    logger.debug("Created temporary filename: ", tempFilePath);
    return utils.promise.nfcall(fs.writeFile, tempFilePath, configFile);
  };

  function findOpenPorts() {
    var portOne = utils.promise.nfcall(portfinder.getPort),
        portTwo = utils.promise.nfcall(portfinder.getPort);

    return utils.promise.all([portOne, portTwo]).then(function(ports) {
      logger.debug("Assigned Ports", ports);
      return ports;
    });
  };

};
