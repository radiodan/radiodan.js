var Invoker   = require('./invoker'),
    validator = require('./validators/action');

var actions = {
  play    : require('./actions/play'),
  'player.volume' : require('./actions/player/volume'),
  database: require('./actions/database'),
};

module.exports = Invoker.create(actions, validator);
