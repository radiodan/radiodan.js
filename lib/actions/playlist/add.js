'use strict';

var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  var mpdCommands = [];

  if (options.clear) {
    mpdCommands.push(['clear']);
  }

  options.playlist.forEach(function(file) {
    mpdCommands.push(['add', file]);
  });

  return radio.sendCommands(mpdCommands);
};
