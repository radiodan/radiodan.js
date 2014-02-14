var Invoker       = require('./invoker'),
    validator     = require('./validators/action'),
    SimpleCommand = require('./actions/simple-command'),
    ToggleCommand = require('./actions/toggle-command');

var actions = {
  'database.search' : require('./actions/database/search'),
  'database.update' : require('./actions/database/update'),
  'player.next'     : SimpleCommand('next'),
  'player.pause'    : ToggleCommand('pause'),
  'player.play'     : require('./actions/player/play'),
  'player.previous' : SimpleCommand('previous'),
  'player.random'   : ToggleCommand('random'),
  'player.repeat'   : ToggleCommand('repeat'),
  'player.seek'     : require('./actions/player/seek'),
  'player.stop'     : SimpleCommand('stop'),
  'player.volume'   : require('./actions/player/volume'),
  'playlist.add'    : require('./actions/playlist/add'),
  'playlist.clear'  : SimpleCommand('clear'),
  'playlist.delete' : ToggleCommand('delete'),
  'playlist.move'   : require('./actions/playlist/move'),
};

module.exports = Invoker.create(actions, validator);
