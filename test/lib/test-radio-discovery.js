var EventEmitter   = require('events').EventEmitter;
    RadioDiscovery = require(libDir + '/radio-discovery');

describe('radio discovery', function() {
  beforeEach(function() {
    var exchangeMock = sinon.stub().returns(utils.promise.resolve());

    this.radio = { config: { name: 'radio', id: 'radio1' } };
    this.messageClientMock = new EventEmitter();
    this.messageClientMock.createAndBindToExchange = exchangeMock;
  });

  it('listens for discovery topics via the messaging client', function(done) {
    var messageClientMock = this.messageClientMock,
        exchangeMock      = messageClientMock.createAndBindToExchange

    RadioDiscovery.create([this.radio], messageClientMock);

    assert.equal(exchangeMock.callCount, 1);

    assert.deepEqual(
      exchangeMock.firstCall.args[0],
      { exchangeName: 'radiodan',
        topicsKey: 'command.discovery.player' }
    );

    assert.isFulfilled(exchangeMock())
      .then(function() {
        var listeners = messageClientMock.listeners('command.discovery.player');
        assert.equal(listeners.length, 1);
      })
      .then(done,done);
  });

  it('responds to discovery events with radio information', function(done) {
    var response = {
      properties: { replyTo: 'response.queue' },
      content:    { correlationId: '1' }
    };

    var messageClientMock = this.messageClientMock,
        exchangeMock      = messageClientMock.createAndBindToExchange;

    messageClientMock.sendToQueue = sinon.spy();

    RadioDiscovery.create([this.radio], messageClientMock);

    assert.isFulfilled(exchangeMock())
      .then(function() {
        messageClientMock.emit('command.discovery.player', response);

        var callCount = messageClientMock.sendToQueue.callCount,
            callArgs = messageClientMock.sendToQueue.firstCall.args;

        assert.equal(callCount, 1);
        assert.equal(callArgs[0], 'response.queue');
        assert.deepEqual(callArgs[1].response, [{name: 'radio', id: 'radio1'}]);
      })
      .then(done,done);
  });
});
