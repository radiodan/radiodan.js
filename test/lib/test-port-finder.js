var PortFinder = require(libDir + 'port-finder');

describe('PortFinder', function (){
  beforeEach(function() {
    var portFinder =  {};
        portFinder.basePort = 49152;
        portFinder.nextPortPromise = function() {
          return utils.promise.resolve(portFinder.basePort++);
        }

   this.portFinder = portFinder;
  });

  it('finds a single port', function(next) {
    var subject   = PortFinder.create(this.portFinder),
        nextPorts = subject.next(1);

    nextPorts.then(function(ports) {
      assert.deepEqual([49152], ports);
    }).then(next,next);
  });

  it('finds multiple ports', function(next) {
    var subject   = PortFinder.create(this.portFinder),
        nextPorts = subject.next(2);

    nextPorts.then(function(ports) {
      return assert.deepEqual([49152, 49153], ports);
    }).then(next,next);
  });

  it('never finds the same port twice', function(next) {
    var subject   = PortFinder.create(this.portFinder),
        nextPorts = subject.next(1),
        morePorts = subject.next(1);

    utils.promise.all([nextPorts, morePorts]).then(function(ports) {
      assert.deepEqual([49152], ports[0]);
      assert.deepEqual([49153], ports[1]);
    }).then(next,next);
  });

  it('finds no ports', function(next) {
    var subject   = PortFinder.create(this.portFinder),
        nextPorts = subject.next('lol');

    nextPorts.then(function(ports) {
      assert.deepEqual([], ports);
    }).then(next,next);
  });
});
