var utils = require('radiodan-client').utils;

module.exports = function(options) {
  var validOptions;

  if(!options.playlist || options.playlist.length === 0) {
    return utils.promise.reject(new Error('Playlist is empty'));
  }

  if(typeof options.playlist === 'string') {
    options.playlist = [options.playlist];
  }

  validOptions = {
    playlist: options.playlist,
    clear   : options.clear === true,
  };

  return utils.promise.resolve(validOptions);
};
