'use strict';

var utils          = require('radiodan-client').utils,
    formatResponse = require('../../states/playlist').formatResponse;

module.exports = function(radio, options) {
  options = options || {};

  var commands = options.terms;

  commands.unshift('search');

  return radio.sendCommands([commands])
    .then(function(response) {
      return formatResponse(radio, response);
    });
};
