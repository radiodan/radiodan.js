describe('action', function() {
  beforeEach(function() {
    this.subject = require(libDir + 'action');
  });

  it('is an invoker', function() {
    assert.isFunction(this.subject.invoke);
  });

  it('has a list of available methods', function() {
    var methodNames = Object.keys(this.subject.methods);

    assert(methodNames.length > 0, 'expected more than 0 method names');
  });

  it('has actions in the form {topic}.{event}', function() {
    var allowedTopics = ['database', 'player', 'playlist'],
        actionFormat = new RegExp(
          '^(' + allowedTopics.join('|') + '){1}\.\\w+$'
        ),
        subject = this.subject,
        methodNames = Object.keys(subject.methods);

    methodNames.forEach(function(m) {
      assert.match(m, actionFormat);
    });
  });

  it('has a function for every available method', function() {
    var subject = this.subject,
        methodNames = Object.keys(subject.methods);

    methodNames.forEach(function(m) {
      assert.isFunction(
        subject.methods[m],
        'expected '+m+' to have a function'
      );
    });
  });
});
