var utils       = require('radiodan-client').utils,
    playerState = require('../../state');

module.exports = function(radio, options, state) {
  state = state || playerState;

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
