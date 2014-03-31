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

  instance.build    = buildConfig;
  instance.fileName = fileName;

  instance.write = function(config) {
    var firstPort;

    return findOpenPorts()
           .then(function(ports) {
             firstPort = ports[0];

             return buildConfig(config, ports);
           })
           .then(writeConfigToDisk)
           .then(function(filePath) {
             return [filePath, firstPort];
           });
  };

  return instance;

  function writeConfigToDisk(config) {
    var configFile = fileName();

    var written = utils.promise.spread(
      [configFile, config], writeToDisk
    );

    return written.then(fileName);
  }

  function buildConfig(config, ports) {
    return setPorts(config, ports)
      .then(setPlatform)
      .then(setFormat)
      .then(renderTemplate);
  }

  function setPorts(config, ports) {
    ports = ports || [];

    //assign generated port to current config
    config.port     = ports[0];
    config.httpPort = ports[1];

    return utils.promise.resolve(config);
  };

  function setPlatform(config) {
    config[config.platform] = true;
    delete config.platform;

    return utils.promise.resolve(config);
  }

  function setFormat(config) {
    var mono   = '44100:16:1',
        stereo = '44100:16:2',
        output = config.audioOutput || '';

    delete config.output;

    if(output.toLowerCase() === 'mono') {
      config.format = mono;
    } else {
      config.format = stereo;
    }

    return utils.promise.resolve(config);
  }

  function renderTemplate(config) {
    return Mustache.render(template, config);
  }

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
