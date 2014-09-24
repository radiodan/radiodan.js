var subject = require(libDir + 'states/player');

describe('status action', function() {
  it('requests current status', function() {
    var statusPromise = utils.promise.resolve(),
        radio = { sendCommands: sinon.stub().returns(statusPromise) };

    subject(radio);

    assert.equal(1, radio.sendCommands.callCount);
    assert.ok(radio.sendCommands.calledWith([
      ['status']
    ]));
  });

  it('formats status string into object', function(done) {
    var statusString = sinon.stub(),
        statusPromise = utils.promise.resolve(statusString),
        radio = {
          sendCommands: sinon.stub().returns(statusPromise),
          formatResponse: sinon.spy()
        };

    var promise = subject(radio);

    assert.isFulfilled(promise).then(function(response) {
      assert.ok(radio.formatResponse.calledWith(statusString));
    }).then(done,done);
  });
});
