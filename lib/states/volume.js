var utils = require('radiodan-client').utils,
    state = require('../state');

module.exports = function(radio, options) {
  var options = options || {},
      state   = options.state || state;

  return state.invoke(radio, 'player')
              .then(function (status) {
                return { volume: status.volume };
              });
};
