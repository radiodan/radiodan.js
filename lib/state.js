var Invoker = require('./invoker');

var actions = {
  playlist : require('./states/playlist'),
  player   : require('./states/player'),
  volume   : require('./states/volume'),
  database : require('./states/database'),
};

module.exports = Invoker.create(actions);
