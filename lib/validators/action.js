var Invoker  = require('../invoker'),
    utils    = require('radiodan-client').utils,
    toggle   = require('./actions/toggle'),
    position = require('./actions/position');

function empty() {
  return utils.promise.resolve({});
}

var validators = {
  'database.search' : require('./actions/database/search'),
  'database.update' : require('./actions/database/update'),
  'player.next'     : empty,
  'player.pause'    : toggle,
  'player.play'     : require('./actions/player/play'),
  'player.previous' : empty,
  'player.random'   : toggle,
  'player.repeat'   : toggle,
  'player.seek'     : require('./actions/player/seek'),
  'player.stop'     : empty,
  'player.volume'   : require('./actions/player/volume'),
  'player.status'   : empty,
  'playlist.add'    : require('./actions/playlist/add'),
  'playlist.clear'  : empty,
  'playlist.delete' : position,
  'playlist.move'   : require('./actions/playlist/move'),
};

function customInvokeAction(radio, method, options) {
  return method(options);
}

module.exports = Invoker.create(validators, null, customInvokeAction);
