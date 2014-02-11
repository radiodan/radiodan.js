var Invoker   = require('./invoker'),
    validator = require('./validators/action');

var actions = {
  'player.volume'  : require('./actions/player/volume'),
  'player.play'    : require('./actions/player/play'),
  'playlist.add'   : require('./actions/playlist/add'),
  'database.update': require('./actions/database/update'),
};

module.exports = Invoker.create(actions, validator);
