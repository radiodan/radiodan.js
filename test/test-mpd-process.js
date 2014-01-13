var assert = require("assert"),
    sinon  = require("sinon");

var waitForSocket = require("../lib/wait-for-socket");

describe('waitForSocket', function(){
  describe('#addHandlers()', function(){
    it('should listen for connect and error events', function(){
      var port = 65535;
      var mockSocket = { on: sinon.spy() };
      var waitFor = waitForSocket.create(port, mockSocket);

      waitFor._addHandlers();

      assert.equal(mockSocket.on.calledTwice, true);
      assert.equal(mockSocket.on.calledWith('connect'), true);
      assert.equal(mockSocket.on.calledWith('error'), true);
    })
  })
});
