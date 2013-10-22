var Mustache = require('mustache'),
    fs       = require('fs'),
    Q        = require('q'),
    tmp      = require('tmp');

var templatePath = __dirname + '/../templates/mpd.conf.mustache';
var template = fs.readFileSync(templatePath, 'utf8');
var port     = 6600;

exports.port = function() {
  return port++;
}

exports.write = function(config) {
  var deferred = Q.defer(),
      mpdConf;
  
  mpdConf     = Mustache.render(template, config),

  tmp.tmpName(function _tempNameGenerated(err, tempFilePath) {
    if (err) {
      console.log('err', err);
      deferred.reject(err);
    } else {
      fs.writeFileSync(tempFilePath, mpdConf);
      console.log("Created temporary filename: ", tempFilePath);
      deferred.resolve(tempFilePath);
    }
  });

  return deferred.promise;
}
