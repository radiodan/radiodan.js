'use strict';

var Mustache   = require('mustache'),
    fs         = require('fs'),
    tmp        = require('tmp'),
    utils      = require('radiodan-client').utils,
    logger     = utils.logger(__filename),
    templatePath = __dirname + '/templates/%s.mustache';

module.exports.create = function(options, ports) {
  options = options || {};

  return {build: build, write: write};

  function build() {
    var deferred = utils.promise.defer(),
        text = renderTemplate(options, ports);

    deferred.resolve(text);

    return deferred.promise;
  }

  function write() {
    return build()
      .then(writeConfigToDisk)
      .then(function(filePath) {
        return utils.promise.resolve([filePath, ports[0]]);
      })
      .then(null, utils.failedPromiseHandler(logger));
  }
};

function renderTemplate(options, ports) {
  var templateFile = templatePath.replace('%s', options.player),
      template     = fs.readFileSync(templateFile, 'utf8');

  options.port = ports[0];
  options.httpPort = ports[1];

  logger.debug("mpd telnet port: " + options.port);
  logger.debug("mpd http port: " + options.httpPort);

  return Mustache.render(template, options);
}

function writeConfigToDisk(content) {
  var generateFileName = utils.promise.nfcall(tmp.tmpName);

  return generateFileName.then(function(tmpFilePath) {
    logger.debug("Writing mpd config to file " + tmpFilePath);

    return utils.promise.nfcall(fs.writeFile, tmpFilePath, content)
      .then(function() { return tmpFilePath; });
  });
}
