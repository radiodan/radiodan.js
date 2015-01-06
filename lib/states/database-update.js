var utils = require('radiodan-client').utils;

module.exports = {
  start: update,
  end:   update
};

function update() {
  return utils.promise.resolve({});
}
