var Invoker       = require('./invoker'),
    validator     = require('./validators/action'),
    SimpleCommand = require('./actions/simple-command'),
    ToggleCommand = require('./actions/toggle-command');

var actions = {
  'player.volume'  : require('./actions/player/volume'),
  'player.play'    : require('./actions/player/play'),
  'player.next'    : SimpleCommand('next'),
  'player.previous': SimpleCommand('previous'),
  'player.stop'    : SimpleCommand('stop'),
  'player.repeat'  : ToggleCommand('repeat'),
  'player.random'  : ToggleCommand('random'),
  'player.pause'   : ToggleCommand('pause' ),
  'playlist.add'   : require('./actions/playlist/add'),
  'playlist.clear' : SimpleCommand('clear'),
  'database.update': require('./actions/database/update'),
};

module.exports = Invoker.create(actions, validator);
