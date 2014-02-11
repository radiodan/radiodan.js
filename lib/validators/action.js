var Invoker = require('../invoker'),
    utils   = require('radiodan-client').utils;

function empty() {
  return utils.promise.resolve({});
}

var validators = {
  'player.volume'   : require('./actions/player/volume'),
  'player.play'     : require('./actions/player/play'),
  'player.next'     : empty,
  'player.previous' : empty,
  'playlist.add'    : require('./actions/playlist/add'),
  'database.update' : require('./actions/database/update'),
};

function customInvokeAction(radio, method, options) {
  return method(options);
}

module.exports = Invoker.create(validators, null, customInvokeAction);
