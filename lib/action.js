var utils = require('./utils'),
    instance = {
      actions: {
        random: require('./actions/random'),
        volume: require('./actions/volume'),
        play: require('./actions/play')
      },
    };

instance.invoke = function (radio, actionName, options) {
  options = options || {};

  var action = instance.actions[actionName];

  if(action) {
    return action(radio, options);
  } else {
    var error = new Error("Don't know what to do with " + actionName);
    return utils.promise.reject(error);
  }
}

module.exports = instance;
