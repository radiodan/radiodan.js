var utils = require('radiodan-client').utils,
    logger = utils.logger(__filename);

function defaultInvokeActionWithRadio(radio, method, options) {
  return method(radio, options);
}

function create(methods, validator, invokeAction) {
  var methods = methods || {},
      instance = {},
      invokeAction = invokeAction || defaultInvokeActionWithRadio;

    instance.invoke = function (radio, methodName, options) {
      options = options || {};

      var method = methods[methodName];

      if(!method) {
        var error = new Error("Don't know what to do with method " + methodName);
        return utils.promise.reject(error);
      }

      // `options` is either the options object passed into the invoke()
      // function or the validated options objects created
      // by a validation function
      function runInvokeAction(options) {
        return invokeAction(radio, method, options);
      }

      if (validator) {
        return validator.invoke(null, methodName, options)
                        .then(runInvokeAction)
                        .then(null, utils.failedPromiseHandler(logger));
      } else {
        return runInvokeAction(options);
      }
    }

  return instance;
}

module.exports = { create: create };
