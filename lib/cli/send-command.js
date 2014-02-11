var utils = require('radiodan-client').utils;

/*
 play=true,position=1 -> { play: true, position: 1 }
*/
function inputToObject(input) {
  return input.split(',')
              .map(function (item) { return item.split('='); })
              .reduce(function (prev, current) {
                var key = current[0],
                    val = current[1];

                val = (val === 'true')  ? true  : val;
                val = (val === 'false') ? false : val;

                prev[key] = val;
                return prev;
              }, {});
}

function sendCommand(radio, action, optionsString) {
  if (!action) {
    return utils.promise.reject();
  }

  var options = inputToObject(optionsString);
  return radio.sendCommandForAction(action, options);
}

module.exports = sendCommand;
