var utils = require('radiodan-client').utils,
    instance = {
      actions: {
        play: require('./actions/play'),
        playlist: require('./actions/playlist'),
        random: require('./actions/random'),
        status: require('./actions/status'),
        volume: require('./actions/volume'),
      },
    };

instance.invoke = function (radio, actionName, options) {
  options = options || {};

  var action = instance.actions[actionName];

  if(action) {
    return action(radio, options);
  } else {
    var error = new Error("Don't know what to do with action " + actionName);
    return utils.promise.reject(error);
  }
}

module.exports = instance;
