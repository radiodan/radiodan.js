var utils = require('../utils');

module.exports = function(radio, options) {
  if(!options.playlist || options.playlist.length == 0) {
    return utils.promise.reject('Playlist is empty');
  }

  var mpdCommands = [['clear']];

  options.playlist.forEach(function(file) {
    mpdCommands.push(['add', file]);
  });

  mpdCommands.push(['random', '0']);

  if(options.playNow) {
    mpdCommands.push(['play', '0']);
  }

  return radio.sendCommands(mpdCommands);
};
