'use strict';

var utils = require('radiodan-client').utils;

module.exports = function(options) {
  var validOptions = {};

  if (options.hasOwnProperty('position')) {
    validOptions.position = parseInt(options.position, 10);
    if (isNaN(validOptions.position)) {
      return utils.promise.reject(new Error('Play position must be an integer'));
    }
  }

  return utils.promise.resolve(validOptions);
};
