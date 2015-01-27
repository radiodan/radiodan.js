var Invoker   = require('./invoker'),
    utils     = require('radiodan-client').utils,
    logger    = utils.logger(__filename),
    validator = require('./validators/state-emitter');

function noOp() {
  return utils.promise.resolve([]);
}

var actions = {
  database : noOp,
  player   : require('./state-emitters/player'),
  playlist : noOp,
  volume   : noOp
};

function customInvoker(oldData, method, newData) {
  return method(oldData, newData);
}

module.exports = function() {
  var instance = {},
      cache    = {},
      invoker  = Invoker.create(actions, validator, customInvoker);

  instance.invoke = function(methodName, newData, oldData) {
    //pull old data from cache
    oldData = oldData || cache[methodName] || null;

    cache[methodName] = newData;

    return invoker.invoke(oldData, methodName, newData);
  };

  return instance;
}();
