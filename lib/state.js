var Invoker = require('./invoker');

var actions = {
  playlist: require('./states/playlist'),
  player  : require('./states/player'),
};

module.exports = Invoker.create(actions);
