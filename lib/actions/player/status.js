var utils = require('radiodan-client').utils,
    state = require('../../state');

module.exports = function(radio, options) {
  return utils.promise.spread(
    [
      state.invoke(radio, 'player'),
      state.invoke(radio, 'playlist')
    ],
    function (player, playlist) {
      return {
        player: player,
        playlist: playlist
      };
    }
  );
};
