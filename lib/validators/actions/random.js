var utils = require('radiodan-client').utils;

module.exports = function(options) {
  if(options.directory && typeof options.directory === 'string') {
    return utils.promise.resolve({
              directory: options.directory
            });
  } else {
    return utils.promise.reject(new Error('Directory not found'));
  }
};
