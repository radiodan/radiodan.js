var utils = require('radiodan-client').utils;

module.exports = function (config, idGenerator) {
  config = config || {};
  idGenerator = idGenerator || utils.uuid;

  config.defaults = config.defaults || {};
  config.radios   = (config.radios instanceof Array) ? config.radios : [];

  // id properties must be assigned to radios directly
  delete config.defaults.id;

  return config.radios.map(function (radio) {
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

