'use strict';

var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  var mpdCommands = ['play'];

  if (options.hasOwnProperty('position')) {
    mpdCommands.push(options.position);
  }

  return radio.sendCommands([ mpdCommands ]);
};
