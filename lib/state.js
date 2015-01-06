'use strict';

var Invoker   = require('./invoker'),
    validator = require('./validators/state'),
    databaseAction = require('./states/database-modified'),
    updateAction  = require('./states/database-update');


var actions = {
  database : databaseAction,
  player   : require('./states/player'),
  playlist : require('./states/playlist'),
  volume   : require('./states/volume'),
  'database.modified' : databaseAction,
  'database.update.start' : updateAction.start,
  'database.update.end' : updateAction.end
};

module.exports = Invoker.create(actions, validator);
