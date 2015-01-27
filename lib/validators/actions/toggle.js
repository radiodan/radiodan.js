'use strict';

var utils = require('radiodan-client').utils;

module.exports = function(options) {
  var validOptions = {};

  if (!options.hasOwnProperty('value')) {
    return utils.promise.reject(new Error('Toggle value is required'));
  }

  if (options.value === true ) {
    validOptions.value = 1;
  } else if (options.value === false) {
    validOptions.value = 0;
  } else {
    return utils.promise.reject(new Error('Toggle value must be boolean'));
  }

  return utils.promise.resolve(validOptions);
};
