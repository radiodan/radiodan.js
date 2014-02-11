var Invoker   = require('./invoker'),
    validator = require('./validators/action');

var actions = {
  play    : require('./actions/play'),
  'player.volume'  : require('./actions/player/volume'),
  'database.update': require('./actions/database/update'),
};

module.exports = Invoker.create(actions, validator);
