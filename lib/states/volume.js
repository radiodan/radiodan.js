'use strict';

var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  var state;
  options = options || {};
  state   = options.state || require('../state');

  return state.invoke(radio, 'player')
              .then(function (status) {
                return { volume: status.volume };
              });
};
