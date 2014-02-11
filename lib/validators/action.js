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
  'player.stop'     : empty,
  'player.repeat'   : require('./actions/player/repeat'),
  'player.random'   : require('./actions/player/repeat'),
  'playlist.add'    : require('./actions/playlist/add'),
  'playlist.clear'  : empty,
  'database.update' : require('./actions/database/update'),
};

function customInvokeAction(radio, method, options) {
  return method(options);
}

module.exports = Invoker.create(validators, null, customInvokeAction);
