var Invoker       = require('./invoker'),
    validator     = require('./validators/action'),
    SimpleCommand = require('./actions/simple-command');

var actions = {
  'player.volume'  : require('./actions/player/volume'),
  'player.play'    : require('./actions/player/play'),
  'player.next'    : SimpleCommand('next'),
  'player.previous': SimpleCommand('previous'),
  'player.stop'    : SimpleCommand('stop'),
  'player.repeat'  : require('./actions/player/repeat'),
  'player.random'  : require('./actions/player/random'),
  'playlist.add'   : require('./actions/playlist/add'),
  'playlist.clear' : SimpleCommand('clear'),
  'database.update': require('./actions/database/update'),
};

module.exports = Invoker.create(actions, validator);
