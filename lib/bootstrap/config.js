'use strict';

var utils = require('radiodan-client').utils;

module.exports = function (config, idGenerator) {
  config = config || {};
  config.players = config.players || [];
  idGenerator = idGenerator || utils.uuid;

  if(config.players.length < 1) {
    throw new Error("No players found");
  }

  config.defaults = config.defaults || {};
  config.players  = (config.players instanceof Array) ? config.players : [];

  // id properties must be assigned to players directly
  delete config.defaults.id;

  return config.players.map(function (radio) {
    var merged = utils.mergeObjects(config.defaults, radio);

    merged.id = merged.id || idGenerator();

    throwOnInvalidId(merged.id);

    merged.name = merged.name || "radiodan_"+merged.id;

    return merged;
  });
};

function throwOnInvalidId(id) {
  if (!/^[a-z0-9]+$/i.test(id)) {
    throw new Error('Invalid radio id: ' + id);
  }
}

