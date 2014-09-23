var utils             = require('radiodan-client').utils,
    radioPlayer       = require('./radio-player')
    configParser      = require('./bootstrap/config'),
    addSystemDefaults = require('./bootstrap/add-system-defaults'),
    createPaths       = require('./bootstrap/create-paths'),
    radioDiscovery    = require('./radio-discovery');

exports.generateRadios = function (configObj, configPath) {
  var parsedConfigs = configParser(configObj),
      systemDefaults = addSystemDefaults.create(configObj.dataPath),
      allRadios;

  var radioPromises = parsedConfigs.map(function(config) {
    // generate config files for each player
    var fullConfig = systemDefaults.add(config);

    // make sure the paths mentioned in the config exist
    createPaths(fullConfig, configPath);

    // create player object, spawning player process
    return radioPlayer.create(fullConfig);
  });

  allRadios = utils.promise.all(radioPromises);

  // start the discovery mechanism once all the radios are ready
  allRadios.then(radioDiscovery.create);

  // return all the radio objects as a promise
  return allRadios;
};
