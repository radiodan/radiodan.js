var Invoker = require('./invoker');

var actions = {
  play: require('./actions/play'),
  playlist: require('./actions/playlist'),
  random: require('./actions/random'),
  status: require('./actions/status'),
  volume: require('./actions/volume'),
};

module.exports = Invoker.create(actions);
