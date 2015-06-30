'use strict';

var simpleCommand = require('./actions/simple-command'),
    toggleCommand = require('./actions/toggle-command'),
    actions = {
  'database.search' : require('./actions/database/search'),
  'database.update' : require('./actions/database/update'),
  'player.next'     : simpleCommand('next'),
  'player.pause'    : toggleCommand('pause'),
  'player.play'     : require('./actions/player/play'),
  'player.previous' : simpleCommand('previous'),
  'player.random'   : toggleCommand('random'),
  'player.repeat'   : toggleCommand('repeat'),
  'player.seek'     : require('./actions/player/seek'),
  'player.stop'     : simpleCommand('stop'),
  'player.volume'   : require('./actions/player/volume'),
  'player.status'   : require('./actions/player/status'),
  'playlist.add'    : require('./actions/playlist/add'),
  'playlist.clear'  : simpleCommand('clear'),
  'playlist.delete' : toggleCommand('delete'),
  'playlist.load'   : require('./actions/playlist/load'),
  'playlist.move'   : require('./actions/playlist/move'),
};

module.exports = actions;
