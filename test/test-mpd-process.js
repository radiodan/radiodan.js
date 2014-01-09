var assert = require("assert");
var waitForSocket = require("../lib/wait-for-socket");

describe('waitForSocket', function(){
  describe('#connect()', function(){
    it('should resolve when socket is connected', function(){
      var port = 65535;
      var waitFor = waitForSocket.create(port);

      waitFor.onConnect();
      var promise = waitFor.connect();

      assert.equal(true, promise.isFulfilled());
    })
  })
});
