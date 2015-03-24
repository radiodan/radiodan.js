'use strict';

var subject = require(libDir + 'player/mpd/state');

describe('state', function() {
  it('is an invoker', function() {
    assert.isFunction(subject.invoke);
  });

  it('has a list of state-based methods', function() {
    var methodNames = Object.keys(subject.methods);
    assert.ok(methodNames.length > 0);

    methodNames.forEach(function(m) {
      assert.isFunction(subject.methods[m]);
    });
  });
});
