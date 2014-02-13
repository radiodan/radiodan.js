var uuid = require('radiodan-client').utils.uuid;

module.exports = function (config, id) {
  config = config || {};
  id = id || uuid;

  config.defaults = config.defaults || {};
  config.radios   = (config.radios instanceof Array) ? config.radios : [];

  // id properties must be assigned to radios directly
  delete config.defaults.id;

  return config.radios.map(function (radio) {
    var merged = mergeObjects(config.defaults, radio);
    merged.id = merged.id || id();

    if (merged.id){
      throwOnInvalidId(merged.id);
    }

    return merged;
  });
};

function throwOnInvalidId(id) {
  if (!/^[a-z0-9]+$/i.test(id)) {
    throw new Error('Invalid radio id: ' + id);
  }
}

function mergeObjects(defaultObj, specificObj) {
    var obj = JSON.parse(JSON.stringify(defaultObj)),
        cleanSpecificObj = JSON.parse(JSON.stringify(specificObj));

    Object.keys(cleanSpecificObj).forEach(function(key) {
        obj[key] = cleanSpecificObj[key];
    });

    return obj;
}
