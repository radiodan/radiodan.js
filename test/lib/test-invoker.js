var Invoker = require(libDir + '/invoker');

describe('action', function (){
  it('executes a matching action', function() {
    var mockActions = { "test": sinon.spy() },
        radio = sinon.spy(),
        options = sinon.spy(),
        subject = Invoker.create(mockActions);

    subject.invoke(radio, 'test', options);
    assert.ok(mockActions.test.calledWith(radio, options));
  });

  it('returns a rejected promise if the action is not found', function() {
    var mockActions = {},
        radio = sinon.spy(),
        options = sinon.spy(),
        subject = Invoker.create(mockActions);

    var promise = subject.invoke(radio, 'test', options);
    assert.isRejected(promise, Error);
  });
});
