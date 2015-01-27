var utils  = require('radiodan-client').utils,
    logger = utils.logger('state-emitters-player');

module.exports = function(oldData, newData) {
  var newKeys = [];
  oldData = oldData || {};

  Object.keys(newData).forEach(function(key) {
    if(oldData[key] != newData[key]) {
      newKeys.push({
        eventName: 'player.' + key,
        data: {
          old: oldData[key],
          new: newData[key]
        }
      });
    }
  });

  return utils.promise.resolve(newKeys);
};
