var utils = require('radiodan-client').utils;

module.exports = function(options) {
  try {
    var value = parseOptions(options);
    return utils.promise.resolve({value: value});
  } catch(err) {
    return utils.promise.reject(err);
  }
};

function parseOptions(options) {
  var value = false;

  if (options.hasOwnProperty('position')) {
    value = parseInt(options.position, 10);
  }

  if (options.hasOwnProperty('start') && options.hasOwnProperty('end')) {
    if(value !== false) {
      throw new Error('Cannot set range and absolute position');
    }

    value = parseRange(options.start, options.end);
  }

  if (value === false) {
    throw new Error('No range or position found.');
  }

  return value;
}

function parseRange(start, end) {
  start = parseInt(start, 10),
  end   = parseInt(end, 10);

  if(start < 0 || end < 0) {
    throw new Error('Range must be positive integer');
  }

  if(start > end) {
    throw new Error('Range must end with higher number');
  }

  return start+':'+end;
}
