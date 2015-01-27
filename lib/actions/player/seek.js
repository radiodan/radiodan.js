'use strict';

var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  var mpdCommands = [];

  if(options.position) {
    mpdCommands = ['seek', options.position, options.time];
  } else {
    mpdCommands = ['seekcur', options.time];
  }

  return radio.sendCommands([mpdCommands]);
};
