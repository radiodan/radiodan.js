var utils = require('radiodan-client').utils;

function boundVolume(vol) {
  if(vol < 0) {
    vol = 0;
  } else if(vol > 100) {
    vol = 100;
  }
  return vol;
}

module.exports = function(options) {
  var validOptions = {};

  if (options.hasOwnProperty('value')) {
    validOptions.value = parseInt(options.value);
    if (isNaN(validOptions.value) || validOptions.value < 0 || validOptions.value > 100) {
      return utils.promise.reject(new Error('Volume value must be integer percentage 0 - 100'));
    }
  }

  if (options.hasOwnProperty('diff')) {
    validOptions.diff = parseInt(options.diff);
    if (isNaN(validOptions.diff)) {
      return utils.promise.reject(new Error('Volume diff must be integer'));
    }
  }

  if (!options.hasOwnProperty('value') && !options.hasOwnProperty('diff')) {
    return utils.promise.reject(new Error('Volume requires value or diff property'));
  }

  if (validOptions.diff && validOptions.value) {
    return utils.promise.reject(new Error('Diff and value provided - must have only 1'));
  }

  return utils.promise.resolve(validOptions);
};
