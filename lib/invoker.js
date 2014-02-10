var utils = require('radiodan-client').utils,
    logger = utils.logger(__filename);

function create(methods, validator) {
  var methods = methods || {},
      instance = {};

    instance.invoke = function (radio, methodName, options) {
      options = options || {};

      var method = methods[methodName];

      function invokeAction(options) {
        if (radio) {
          return method(radio, options);
        } else {
          return method(options);
        }
      }

      if(!method) {
        var error = new Error("Don't know what to do with method " + methodName);
        return utils.promise.reject(error);
      }

      if (validator) {
        return validator.invoke(null, methodName, options)
                        .then(invokeAction)
                        .then(null, utils.failedPromiseHandler(logger));
      } else {
        return invokeAction(options);
      }
    }

  return instance;
}

module.exports = { create: create };
