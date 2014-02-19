var radiodan          = require('./radiodan')
    configParser      = require('./bootstrap/config'),
    addSystemDefaults = require('./bootstrap/add-system-defaults'),
    createPaths       = require('./bootstrap/create-paths');

exports.generateRadios = function (configObj) {
  var parsedConfigs = configParser(configObj),
      systemDefaults = addSystemDefaults.create(configObj.dataPath);

  var radioPromises = parsedConfigs.map(function(config) {
    var fullConfig = systemDefaults.add(config);

    createPaths(fullConfig);

    return radiodan.create(fullConfig);
  });

  return utils.promise.all(radioPromises);
};
