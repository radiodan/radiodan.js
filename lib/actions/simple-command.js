
module.exports = function simpleCommand(command) {
  return function (radio) {
    return radio.sendCommands([[command]]);
  }
}
