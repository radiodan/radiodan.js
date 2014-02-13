var utils = require('radiodan-client').utils;

module.exports = function(options) {
  var validOptions = {};

  validOptions.time = parseInt(options.time);
  if (isNaN(validOptions.time)) {
    return utils.promise.reject(
        new Error('Seek time must be an integer')
    );
  }

  if(options.hasOwnProperty('position')) {
    validOptions.position = parseInt(options.position);

    if (isNaN(validOptions.position)) {
      return utils.promise.reject(
        new Error('Playlist position must be an integer')
        );
    }

    if(validOptions.time < 0) {
      return utils.promise.reject(
        new Error('Seek time must be an absolute value')
      );
    }
  }

  return utils.promise.resolve(validOptions);
};
