describe('validators state-emitter', function() {
  beforeEach(function() {
    this.subject = require(libDir + 'validators/state-emitter');
  });

  it('is an invoker', function() {
    assert.isFunction(this.subject.invoke);
  });

  it('has a list of available methods', function() {
    var subject = this.subject,
        methodNames = Object.keys(subject.methods);

    assert(methodNames.length > 0, 'expected more than 0 method names');

    methodNames.forEach(function(m) {
      assert.isFunction(subject.methods[m]);
    });
  });
});
