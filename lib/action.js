var Invoker   = require('./invoker'),
    validator = require('./validators/action');

var actions = {
  'playlist.add'   : require('./actions/playlist/add'),
  'player.volume'  : require('./actions/player/volume'),
  'database.update': require('./actions/database/update'),
};

module.exports = Invoker.create(actions, validator);
