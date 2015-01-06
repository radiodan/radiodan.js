'use strict';

var deepEqual = require('deep-equal'),
    Invoker   = require('../invoker'),
    utils     = require('radiodan-client').utils,
    logger    = utils.logger(__filename);

function isNewData(oldData, newData) {
  if(deepEqual(oldData, newData)) {
    return utils.promise.reject('Data is the same');
  } else {
    return utils.promise.resolve(newData);
  }
}

function passThrough(oldData, newData) {
  return utils.promise.resolve(newData);
}

var validators = {
  player   : isNewData,
  playlist : isNewData,
  volume   : isNewData,
  database : isNewData,
  'database.modified'     : isNewData,
  'database.update.start' : passThrough,
  'database.update.end'   : passThrough
};

function customInvokeAction(oldData, method, newData) {
  return method(oldData, newData);
}

module.exports = Invoker.create(validators, null, customInvokeAction);
