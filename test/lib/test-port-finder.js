/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    utils = require('radiodan-client').utils,
    PortFinder = require('../../lib/port-finder');

chai.use(chaiAsPromised);

describe('PortFinder', function (){
  it('finds a single port', function(next) {
    var subject   = PortFinder.create(),
        nextPorts = subject.next(1);

    nextPorts.then(function(ports) {
      assert.deepEqual([49152], ports);
    }).then(next,next);
  });

  it('finds multiple ports', function(next) {
    var subject   = PortFinder.create(),
        nextPorts = subject.next(2);

    nextPorts.then(function(ports) {
      assert.deepEqual([49152, 49153], ports);
    }).then(next,next);
  });

  it('never finds the same port twice', function(next) {
    var subject   = PortFinder.create(),
        nextPorts = subject.next(1),
        morePorts = subject.next(1);

    utils.promise.all([nextPorts, morePorts]).then(function(ports) {
      assert.deepEqual([49152], ports[0]);
      assert.deepEqual([49153], ports[1]);
    }).then(next,next);
  });

  it('finds no ports', function(next) {
    var subject   = PortFinder.create(),
        nextPorts = subject.next('lol');

    nextPorts.then(function(ports) {
      assert.deepEqual([], ports);
    }).then(next,next);
  });
});
