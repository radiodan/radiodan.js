var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  if(!options.playlist || options.playlist.length == 0) {
    return utils.promise.reject('Playlist is empty');
  }

  var mpdCommands = [['clear']];

  options.playlist.forEach(function(file) {
    mpdCommands.push(['add', file]);
  });

  mpdCommands.push(['random', '0']);

  if(options.playNow == true) {
    var position = options.playPosition || '0';
    if(position > options.playlist.length) {
      return utils.promise.reject('Position greater than playlist length');
    } else {
      mpdCommands.push(['play', position]);
    }
  }

  return radio.sendCommands(mpdCommands);
};
