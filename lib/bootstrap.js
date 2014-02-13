var radiodan     = require('./radiodan')
    configParser = require('./bootstrap/config');

exports.generateRadios = function (configObj) {
  var parsedConfigs = configParser(configObj);

  var radioPromises = parsedConfigs.map(function(config) {
    return radiodan.create(config);
  });

  return utils.promise.all(radioPromises);
};
