var Mustache = require('mustache'),
    fs       = require('fs'),
    Q        = require('q'),
    tmp      = require('tmp');

var templatePath = __dirname + '/../templates/mpd.conf.mustache';
var template = fs.readFileSync(templatePath, 'utf8');
var firstMPDPort = 6600;

exports.create = function() {
  var instance = {};
  instance.port = firstMPDPort++;

  instance.write = function(config) {
    config.port = instance.port;

    var deferred = Q.defer();
    var configFile = Mustache.render(template, config);

    tmp.tmpName(function _tempNameGenerated(err, tempFilePath) {
      if (err) {
        console.log(err);
        deferred.reject(err);
      } else {
        fs.writeFileSync(tempFilePath, configFile);
        console.log("Created temporary filename: ", tempFilePath);
        deferred.resolve(tempFilePath);
      }
    });

    return deferred.promise;
  };

  return instance;
};
