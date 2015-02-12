'use strict';

var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  return radio.sendCommands([ ['repeat', options.value] ]);
};
