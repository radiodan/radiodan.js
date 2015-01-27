'use strict';

var utils = require('radiodan-client').utils,
    logger = utils.logger(__filename);

function defaultInvokeActionWithRadio(radio, method, options) {
  return method(radio, options);
}

function create(methods, validator, invokeAction) {
  var instance = {};

  methods = methods || {};
  invokeAction = invokeAction || defaultInvokeActionWithRadio;

  instance.methods = methods;
  instance.invoke = function (radio, methodName, options) {
    options = options || {};

    var method = methods[methodName];

    if(!method) {
      var msg = "Don't know what to do with method " + methodName;
      return utils.promise.reject(msg);
    }

    // `options` is either the options object passed into the invoke()
    // function or the validated options objects created
    // by a validation function
    function runInvokeAction(options) {
      return invokeAction(radio, method, options);
    }

    if (validator) {
      return validator.invoke(radio, methodName, options)
        .then(runInvokeAction)
        .then(null, utils.failedPromiseHandler(logger));
    } else {
      return runInvokeAction(options);
    }
  };

  return instance;
}

module.exports = { create: create };
