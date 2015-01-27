'use strict';

var utils = require('radiodan-client').utils,
    position = require('../position');

module.exports = function(options) {
  var validOptions = {};

  if(options.hasOwnProperty('to')) {
    validOptions.to = parseInt(options.to, 10);
  } else {
    return utils.promise.reject(new Error('Destination not set'));
  }

  if(options.hasOwnProperty('from')) {
    options.position = options.from;
  }

  return position(options)
    .then(function(position) {
      validOptions.from = position.value;
      return utils.promise.resolve(validOptions);
    });
};
