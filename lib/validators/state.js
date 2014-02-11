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
};

module.exports = Invoker.create(validators);
