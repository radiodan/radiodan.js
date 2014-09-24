var subject = require(libDir + 'validators/action');

describe('state', function() {
  it('is an invoker', function() {
    assert.isFunction(subject.invoke);
  });

  it('has a list of state-based methods', function() {
    var methodNames = Object.keys(subject.methods);

    methodNames.forEach(function(m) {
      assert.isFunction(subject.methods[m]);
    });
  });

  it('has validators in the form {topic}.{event}', function() {
    var allowedTopics = ['database', 'player', 'playlist'],
        actionFormat = new RegExp(
          '^(' + allowedTopics.join('|') + '){1}\.\\w+$'
        ),
        methodNames = Object.keys(subject.methods);

    methodNames.forEach(function(m) {
      assert.match(m, actionFormat);
    });
  });
});
