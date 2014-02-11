var Invoker = require('../invoker'),
    utils   = require('radiodan-client').utils;

function empty() {
  return utils.promise.resolve({});
}

var validators = {
  play     : require('./actions/play'),
  'player.volume' : require('./actions/player/volume'),
  database : require('./actions/database'),
};

function customInvokeAction(radio, method, options) {
  return method(options);
}

module.exports = Invoker.create(validators, null, customInvokeAction);
