var utils = require('radiodan-client').utils;

function create(methods) {
  var methods = methods || {},
      instance = {};

    instance.invoke = function (radio, methodName, options) {
      options = options || {};

      var method = methods[methodName];

      if(method) {
        return method(radio, options);
      } else {
        var error = new Error("Don't know what to do with method " + methodName);
        return utils.promise.reject(error);
      }
    }

  return instance;
}

module.exports = { create: create };
