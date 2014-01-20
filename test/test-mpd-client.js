/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon'),
    winston = require('winston'),
    fs     = require('fs'),
    EventEmitter = require('events').EventEmitter;

var Q = require('q');

chai.use(chaiAsPromised);

var subject = require('../lib/mpd-client');

// chill winston
//winston.remove(winston.transports.Console);

describe('mpdClient', function (){
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
    var command = client.formatCommand(['play', ['1']]);

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
    var commandPromise = client.sendCommands([['add', ['1.mp3']]]);

    assert.isFulfilled(commandPromise).then(function() {
      assert.ok(commandSpy.calledOnce);

      var calledArgs = commandSpy.getCall(0).args[0];

      assert.equal('add', calledArgs[0].name);
      assert.deepEqual(['1.mp3'], calledArgs[0].args);
      done();
    });
  });

  it('listens and re-emits mpd events', function(done){
    var client = subject.create(4321, winston);
    var mpdMock = new EventEmitter();
    var commandSpy = sinon.spy();

    client.connect(mpdMock);

    client.on('system', function(name) {
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
});
