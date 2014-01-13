var assert = require("assert"),
    sinon  = require("sinon"),
    EventEmitter = require("events").EventEmitter,
    net    = require("net");

var waitForSocket = require("../lib/wait-for-socket");

describe('waitForSocket', function(){
  before(function () {
    this.port = 65535;
  });

  beforeEach(function () {
    this.mockSocket = new EventEmitter();
    this.mockSocket.connect = sinon.spy();
    this.mockSocket.setTimeout = sinon.spy();
  });

  describe('#connect', function() {
    it('returns a promise for a connected socket', function () {
      var waitFor = waitForSocket.create(this.port);
      var promise = waitFor.connect();

      assert.equal(promise.isPending(), true);
    });

    it('resolves the promise on connect', function () {
      var waitFor = waitForSocket.create(this.port, this.mockSocket);
      var promise = waitFor.connect();

      this.mockSocket.emit('connect');
      assert.equal(promise.isFulfilled(), true);
    });

    it('sets a timeout on the socket', function () {
      this.mockSocket.setTimeout = sinon.spy();

      var waitFor = waitForSocket.create(this.port, this.mockSocket);
      assert(this.mockSocket.setTimeout.calledWith(2500));
    });


    it('tries again on failure', function () {
      var clock = sinon.useFakeTimers(),
          timeout = 10;

      var waitFor = waitForSocket.create(this.port, this.mockSocket);
      var promise = waitFor.connect();

      this.mockSocket.emit('error');
      clock.tick(timeout + 1);

      assert.equal(this.mockSocket.connect.calledTwice, true);

      this.mockSocket.emit('connect');
      assert.equal(promise.isFulfilled(), true);

      clock.restore();
    });
  });

  describe('#_addHandlers()', function(){
    it('should bind a socket to connect and error events', function(){
      this.mockSocket.on = sinon.spy();
      var waitFor = waitForSocket.create(this.port, this.mockSocket);

      waitFor._addHandlers();

      assert.equal(this.mockSocket.on.calledTwice, true);
      assert.equal(this.mockSocket.on.calledWith('connect'), true);
      assert.equal(this.mockSocket.on.calledWith('error'), true);
    });
  });
});
