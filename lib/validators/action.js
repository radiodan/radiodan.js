var Invoker = require('../invoker'),
    utils   = require('radiodan-client').utils;

function empty() {
  return utils.promise.resolve({});
}

var validators = {
  play    : require('./actions/play'),
  random  : require('./actions/random'),
  volume  : require('./actions/volume'),
  database: require('./actions/database'),
};

module.exports = Invoker.create(validators);
