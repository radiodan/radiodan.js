var Invoker   = require('./invoker'),
    validator = require('./validators/action');

var actions = {
  play    : require('./actions/play'),
  volume  : require('./actions/volume'),
  database: require('./actions/database'),
};

module.exports = Invoker.create(actions, validator);
