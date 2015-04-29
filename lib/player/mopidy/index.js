'use strict';

var mpdPath = '../mpd/';

module.exports = {
  name: 'Mopidy',

  action:  require('./action'),
  state:   require(mpdPath + 'state'),
  player:  require(mpdPath + 'player'),

  supportsPlayer: function(player) {
    return player === 'mopidy';
  }
};
