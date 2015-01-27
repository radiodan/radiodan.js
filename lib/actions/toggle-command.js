'use strict';

var utils = require('radiodan-client').utils;

module.exports = function (command) {
  return function(radio, options) {
    return radio.sendCommands([ [command, options.value] ]);
  };
};
