'use strict';

var Invoker = require('../invoker'),
    utils   = require('radiodan-client').utils;

function empty() {
  return utils.promise.resolve({});
}

var validators = {
  database : empty,
  player   : empty,
  playlist : empty,
  volume   : empty,
  'database.modified'     : empty,
  'database.update.start' : empty,
  'database.update.end'   : empty
};

module.exports = Invoker.create(validators);
