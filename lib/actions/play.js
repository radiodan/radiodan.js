var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  var mpdCommands = [['clear']];

  options.playlist.forEach(function(file) {
    mpdCommands.push(['add', file]);
  });

  mpdCommands.push(['random', '0']);

  if(options.playNow) {
    mpdCommands.push(['play', options.playPosition]);
  }

  return radio.sendCommands(mpdCommands);
};
