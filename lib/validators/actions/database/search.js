var utils = require('radiodan-client').utils,
    validScopes = ["artist", "album", "title", "track", "name", "genre",
    "date", "composer", "performer", "comment", "disc", "filename", "any"];

module.exports = function(options) {
  var terms = [];

  validScopes.forEach(function(scope) {
    if(options.hasOwnProperty(scope)) {
      terms.push(scope, options[scope].toString());
    }
  });

  if(terms.length === 0) {
    return utils.promise.reject('No valid search terms found');
  }

  return utils.promise.resolve({terms: terms});
};

