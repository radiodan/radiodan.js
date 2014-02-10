var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  return radio.sendCommands([['stats']])
              .then(function(stats) {
                var stats = radio.formatResponse(stats);
                return utils.promise.resolve({
                  'totals': {
                    'artists' : stats.artists,
                    'tracks'  : stats.songs,
                    'duration': stats.db_playtime
                  },
                  'updatedAt': new Date(stats.db_update * 1000)
                });
              });
};
