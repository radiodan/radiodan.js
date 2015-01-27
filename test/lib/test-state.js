'use strict';

var subject = require(libDir + 'state');

describe('state', function() {
  it('is an invoker', function() {
    assert.isFunction(subject.invoke);
  });

  it('has a list of state-based methods', function() {
    var methodNames = Object.keys(subject.methods);
    assert.deepEqual(
      methodNames,
      ['database', 'player', 'playlist', 'volume']
    );

    methodNames.forEach(function(m) {
      assert.isFunction(subject.methods[m]);
    });
  });
});
