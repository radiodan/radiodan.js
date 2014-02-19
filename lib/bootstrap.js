var radiodan     = require('./radiodan')
    configParser = require('./bootstrap/config'),
    addSystemDefaultsToConfig = require('./bootstrap/add-system-defaults-to-config');

exports.generateRadios = function (configObj) {
  var parsedConfigs = configParser(configObj);

  var radioPromises = parsedConfigs.map(function(config) {
    var fullConfig = addSystemDefaultsToConfig(config);
    
    return radiodan.create(fullConfig);
  });

  return utils.promise.all(radioPromises);
};
