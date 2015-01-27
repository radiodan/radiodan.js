'use strict';

var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  var mpdCommands = ['move', options.from, options.to];
  return radio.sendCommands([mpdCommands]);
};
