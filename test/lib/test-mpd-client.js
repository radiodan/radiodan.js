/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon'),
    winston = require('winston'),
    fs     = require('fs'),
    EventEmitter = require('events').EventEmitter;

var utils = require('radiodan-client').utils;

chai.use(chaiAsPromised);

var subject = require('../../lib/mpd-client');

describe('mpdClient', function (){
  before(function() {
    // chill winston
    winston.remove(winston.transports.Console);
  });

  after(function() {
    winston.add(winston.transports.Console);
  });

  it('connects an mpd instance to the given port', function(done){
    var client = subject.create(4321, winston);
    var mpdMock = new EventEmitter();
    var connectPromise = client.connect(mpdMock);
    mpdMock.emit('ready');

    assert.isFulfilled(connectPromise).notify(done);
  });

  it('fails when it cannot connect to mpd at a given port', function(done){
    var client = subject.create(4321, winston);
    assert.isRejected(client.connect()).notify(done);
  });

  it('formats commands to an mpd-friendly format', function(){
    var client = subject.create(4321, winston);
    var command = client.formatCommand(['play', '1']);

    assert.equal('play', command.name);
    assert.deepEqual(['1'], command.args);

    var command = client.formatCommand(['play']);

    assert.equal('play', command.name);
    assert.deepEqual([], command.args);
  });

  it('sends formatted commands to the mpd instance', function(done){
    var client = subject.create(4321, winston);
    var mpdMock = new EventEmitter();
    var commandSpy = sinon.spy();
    mpdMock.sendCommands = function(commands,cb){ commandSpy(commands); cb(); }

    client.connect(mpdMock);
    // resolve promise sendCommand is reliant on
    client.ready = function() { var d = utils.promise.defer(); d.resolve(); return d.promise;}

    var commandPromise = client.sendCommands([['add', '1.mp3']]);

    assert.isFulfilled(commandPromise).then(function() {
      assert.ok(commandSpy.calledOnce);

      var calledArgs = commandSpy.getCall(0).args[0];

      assert.equal('add', calledArgs[0].name);
      assert.deepEqual(['1.mp3'], calledArgs[0].args);
      done();
    });
  });

  it('will not send commands unless mpd instance is ready', function(done){
    var client = subject.create(4321, winston);
    var mpdMock = new EventEmitter();
    var connectPromise = client.connect(mpdMock);
    mpdMock.emit('error');

    mpdMock.sendCommands = function(commands,cb){ cb(); }
    var commandPromise = client.sendCommands([['add', ['1.mp3']]]);

    assert.isRejected(connectPromise).then(function() {
      assert.isRejected(commandPromise).notify(done);
    });
  });

  it('will send commands when mpd instance is ready', function(done) {
    var client = subject.create(4321, winston);
    var mpdMock = new EventEmitter();
    var connectPromise = client.connect(mpdMock);
    mpdMock.emit('ready');

    var commandPromise = client.sendCommands([['add', ['1.mp3']]]);
    mpdMock.sendCommands = function(commands,cb){ cb(); }

    assert.isFulfilled(connectPromise).then(function() {
      assert.isFulfilled(commandPromise).notify(done);
    });
  });

  it('listens and emits mpd events', function(done){
    var client = subject.create(4321, winston);
    var mpdMock = new EventEmitter();
    var commandSpy = sinon.spy();

    client.connect(mpdMock);

    client.on('event', function(name) {
      assert.equal('player', name);
      done();
    });

    mpdMock.emit('system','player');
  });

  it('emits errors from mpd instance', function(done){
    var client = subject.create(4321, winston);
    var mpdMock = new EventEmitter();
    var commandSpy = sinon.spy();

    client.connect(mpdMock);

    client.on('error', function(msg) {
      assert.equal('errorMsg', msg);
      done();
    });

    mpdMock.emit('error','errorMsg');
  });

  it('formats multiline responses into objects', function(){
    var statusString = "volume: 100\nrepeat: 1\nstate: stop\n";
    var response = subject.create().formatResponse(statusString);

    assert.equal(100,    response.volume);
    assert.equal('stop', response.state);
    assert.equal('1',    response.repeat);
  });

  it('formats multiline responses into arrays', function(){
    var statusString = "volume: 100\nrepeat: 1\nstate: stop\n";
    var response = subject.create().formatResponse(statusString, true);

    assert.deepEqual(['volume', '100'], response[0]);
    assert.deepEqual(['repeat', '1'],   response[1]);
    assert.deepEqual(['state', 'stop'], response[2]);
  });
});
