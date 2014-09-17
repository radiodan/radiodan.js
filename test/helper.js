'use strict';

//supress log messages
process.env.LOG_LEVEL = 'fatal';

var chai = require('chai'),
    cap  = require('chai-as-promised');

global.sinon        = require('sinon');
global.fs           = require('fs');
global.utils        = require('radiodan-client').utils;
global.EventEmitter = require('events').EventEmitter;
global.winston      = require('winston');
global.assert       = chai.assert;

chai.use(cap);

