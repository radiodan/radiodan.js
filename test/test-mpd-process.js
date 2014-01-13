var assert = require("assert"),
    sinon  = require("sinon");

var waitForSocket = require("../lib/wait-for-socket");

describe('waitForSocket', function(){
  before(function () {
    this.port = 65535;
  });

  describe('#connect', function() {
    it('returns a promise for a connected socket', function () {
      var waitFor = waitForSocket.create(this.port);
      var promise = waitFor.connect();

      assert.equal(promise.isPending(), true);
    });
  });

  describe('#_addHandlers()', function(){
    it('should bind a socket to connect and error events', function(){
      var mockSocket = { on: sinon.spy() };
      var waitFor = waitForSocket.create(this.port, mockSocket);

      waitFor._addHandlers();

      assert.equal(mockSocket.on.calledTwice, true);
      assert.equal(mockSocket.on.calledWith('connect'), true);
      assert.equal(mockSocket.on.calledWith('error'), true);
    });
  });
});
