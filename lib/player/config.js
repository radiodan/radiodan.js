var Mustache   = require('mustache'),
    fs         = require('fs'),
    tmp        = require('tmp'),
    utils      = require('radiodan-client').utils,
    logger     = utils.logger(__filename),
    templatePath = __dirname + '/../../templates/%s.mustache';

module.exports.create = function(options, portsPromise) {
  var instance = {};

  options = options || {};

  instance.write = function() {
    var port;

    return portsPromise
      .then(function(ports) {
        port = ports[0];
        return renderTemplate(options, ports);
      })
    .then(writeConfigToDisk)
    .then(function(filePath) {
      return utils.promise.resolve([filePath, port]);
    })
    .then(null, utils.failedPromiseHandler(logger));
  };

  return instance;
}

function renderTemplate(options, ports) {
  var templateFile = templatePath.replace('%s', options.player),
      template     = fs.readFileSync(templateFile, 'utf8');

  options.port = ports[0];
  options.httpPort = ports[1];

  return Mustache.render(template, options);
}

function writeConfigToDisk(content) {
  var generateFileName = utils.promise.nfcall(tmp.tmpName);

  return generateFileName.then(function(tmpFilePath) {
    return utils.promise.nfcall(fs.writeFile, tmpFilePath, content)
      .then(function() { return tmpFilePath });
  });
}
