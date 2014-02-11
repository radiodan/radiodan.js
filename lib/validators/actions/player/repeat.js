var utils = require('radiodan-client').utils;

module.exports = function(options) {
  var validOptions = {};

  if (!options.hasOwnProperty('value')) {
    return utils.promise.reject(new Error('Repeat value is required'));
  }

  if (options.value === true ) {
    validOptions.value = 1;
  } else if (options.value === false) {
    validOptions.value = 0;
  } else {
    return utils.promise.reject(new Error('Repeat value must be boolean'));
  }

  return utils.promise.resolve(validOptions);
};
