'use strict';

var Invoker   = require('./invoker'),
    validator = require('./validators/state');

var actions = {
  database : require('./states/database'),
  player   : require('./states/player'),
  playlist : require('./states/playlist'),
  volume   : require('./states/volume'),
};

module.exports = Invoker.create(actions, validator);
