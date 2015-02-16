'use strict';

var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  var command, mpdCommands;

  options = options || {};

  if (options.force) {
    command = 'rescan';
  } else {
    command = 'update';
  }

  if (options.path) {
    mpdCommands = [[command, options.path]];
  } else {
    mpdCommands = [[command]];
  }

  return radio.sendCommands(mpdCommands);
};
