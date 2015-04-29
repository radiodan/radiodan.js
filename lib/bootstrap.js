'use strict';

var utils             = require('radiodan-client').utils,
    radioPlayer       = require('./radio-player'),
    configParser      = require('./bootstrap/config'),
    addSystemDefaults = require('./bootstrap/add-system-defaults'),
    createPaths       = require('./bootstrap/create-paths');

exports.generateRadios = function (configObj, configPath, messagingClient) {
  var parsedConfigs = configParser(configObj),
      systemDefaults = addSystemDefaults.create(configObj.dataPath),
      allRadios;

  var radioPromises = parsedConfigs.map(function(config) {
    // generate config files for each player
    var fullConfig = systemDefaults.add(config);

    // make sure the paths mentioned in the config exist
    createPaths(fullConfig, configPath);

    // create player object, spawning player process
    return radioPlayer.create(fullConfig, messagingClient);
  });

  allRadios = utils.promise.all(radioPromises);

  // return all the radio objects as a promise
  return allRadios;
};
