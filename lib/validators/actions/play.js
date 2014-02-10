var utils = require('radiodan-client').utils;

module.exports = function(options) {
  var validOptions = {};

  if(!options.playlist || options.playlist.length == 0) {
    return utils.promise.reject(new Error('Playlist is empty'));
  }

  validOptions = {
    playlist: options.playlist,
    playNow : options.playNow === true,
  };

  if(validOptions.playNow) {
    var position = options.playPosition || '0';
    if(position > options.playlist.length) {
      return utils.promise.reject(new Error('Position greater than playlist length'));
    } else {
      validOptions.position = position;
    }
  }

  return utils.promise.resolve(validOptions);
};
