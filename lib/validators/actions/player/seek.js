'use strict';

var utils = require('radiodan-client').utils;

module.exports = function(options) {
  var validOptions = {};

  validOptions.time = parseInt(options.time, 10);
  if (isNaN(validOptions.time)) {
    return utils.promise.reject(
        new Error('Seek time must be an integer')
    );
  }

  if(options.hasOwnProperty('position')) {
    validOptions.position = parseInt(options.position, 10);

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
  } else {
    // time is an offset to the current track, so should be passed as a string
    if('+'+validOptions.time === options.time) {
      validOptions.time = options.time;
    }
  }

  return utils.promise.resolve(validOptions);
};
