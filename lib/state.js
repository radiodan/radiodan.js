var Invoker = require('./invoker');

var actions = {
  playlist: require('./states/playlist'),
  player  : require('./states/player'),
  volume  : require('./states/volume'),
};

module.exports = Invoker.create(actions);
