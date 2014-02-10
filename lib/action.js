var Invoker = require('./invoker');

var actions = {
  play: require('./actions/play'),
  random: require('./actions/random'),
  volume: require('./actions/volume'),
};

module.exports = Invoker.create(actions);
