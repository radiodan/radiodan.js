var radiodan          = require('./radiodan')
    configParser      = require('./bootstrap/config'),
    addSystemDefaults = require('./bootstrap/add-system-defaults'),
    createPaths       = require('./bootstrap/create-paths'),
    radioDiscovery    = require('./radio-discovery');

exports.generateRadios = function (configObj, configPath) {
  var parsedConfigs = configParser(configObj),
      systemDefaults = addSystemDefaults.create(configObj.dataPath),
      allRadios;

  var radioPromises = parsedConfigs.map(function(config) {
    var fullConfig = systemDefaults.add(config);

    createPaths(fullConfig, configPath);

    return radiodan.create(fullConfig);
  });

  allRadios = utils.promise.all(radioPromises);

  allRadios.then(radioDiscovery.create);

  return allRadios;
};
