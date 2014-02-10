var utils = require('radiodan-client').utils;

module.exports = function(options) {
  var validOptions = {};

  validOptions.force = options.force || false;

  if (validOptions.force !== true && validOptions.force !== false) {
    return utils.promise.reject(new Error('Force must be a boolean'));
  }

  if (options.hasOwnProperty('path') ) {
    if (typeof options.path === 'string') {
      validOptions.path = options.path;
    } else {
      return utils.promise.reject(new Error('Path must be a string'));
    }
  }

  return utils.promise.resolve(validOptions);
};
