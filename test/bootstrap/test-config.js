/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

var utils = require('radiodan-client').utils;

chai.use(chaiAsPromised);

var subject = require('../../lib/bootstrap/config');

describe('bootstrap config', function (){
  beforeEach(function () {
    this.idStub = sinon.stub().returns("genIdx");
  });

  it('returns an array of merged configs', function () {
    var config = {
      "defaults": {
        "music": "~/Music",
        "log"  : "/var/log/"
      },
      "radios": [
        { "id": "x", "name": "My radio", "music" : "/var/data/music" },
        { "id": "x", "name": "another one" }
      ]
    };

    var parsedConfigs = subject(config);

    assert.equal(2, parsedConfigs.length);


    assert.deepEqual({ "id": "x", "name": "My radio", "music": "/var/data/music", "log": "/var/log/" }, parsedConfigs[0]);
    assert.deepEqual({ "id": "x", "name": "another one", "music": "~/Music", "log": "/var/log/" }, parsedConfigs[1]);
  });

  it('returns an empty array if no config', function () {
    var parsedConfigs = subject();
    assert.equal(0, parsedConfigs.length);
  });

  it('returns an empty array if no radios', function () {
    var config = {
      "defaults": {
        "music": "~/Music",
        "log"  : "/var/log/"
      },
      "radios": []
    };

    var parsedConfigs = subject(config);
    assert.equal(0, parsedConfigs.length);
  });

  it('defaults are optional', function () {
    var config = {
      "radios": [
        {
          "id"   : "x",
          "music": "~/Music",
          "log"  : "/var/log/"
        }
      ]
    };

    var parsedConfigs = subject(config);
    assert.equal(1, parsedConfigs.length);
    assert.deepEqual({ "id": "x", "name": "radiodan_x", "music": "~/Music", "log": "/var/log/" }, parsedConfigs[0]);
  });

  it('ids in defaults are ignored', function () {
    var config = {
      "defaults": {
        "id" : "my-radio-id"
      },
      "radios": [
        { "music": "~/Music", "log": "/var/log/" }
      ]
    };

    var parsedConfigs = subject(config, this.idStub);
    assert.equal(1, parsedConfigs.length);
    assert.deepEqual({ "id": "genIdx", "name": "radiodan_genIdx", "music": "~/Music", "log": "/var/log/" }, parsedConfigs[0]);
  });

  it('creates an id if missing from radio config', function () {
    var config = {
          "radios": [
            { "music": "~/Music", "log": "/var/log/" },
            { "music": "~/Music", "log": "/var/log/" }
          ]
        },
        idStub = sinon.stub();

    idStub.onCall(0).returns("genId1");
    idStub.onCall(1).returns("genId2");

    var parsedConfigs = subject(config, idStub);
    assert.equal(2, parsedConfigs.length);
    assert.deepEqual({ "id": "genId1", "name": "radiodan_genId1", "music": "~/Music", "log": "/var/log/" }, parsedConfigs[0]);
    assert.deepEqual({ "id": "genId2", "name": "radiodan_genId2", "music": "~/Music", "log": "/var/log/" }, parsedConfigs[1]);
  });

  it('throws on invalid ids', function () {
    var config = {
          "radios": [
            { "id": "my-invalid*id", "music": "~/Music", "log": "/var/log/" }
          ]
        };

    assert.throws( function () { subject(config); }, Error);
  });
});
