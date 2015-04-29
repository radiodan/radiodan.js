'use strict';

module.exports = {
  name: 'MPD',

  action:  require('./action'),
  state:   require('./state'),
  player:  require('./player'),

  supportsPlayer: function(player) {
    return player === 'mpd';
  }
};
