'use strict';

var chai = require('chai'),
    cap  = require('chai-as-promised');

global.sinon        = require('sinon');
global.winston      = require('winston');
global.fs           = require('fs');
global.utils        = require('radiodan-client').utils;
global.EventEmitter = require('events').EventEmitter;
global.assert       = chai.assert;

chai.use(cap);

//supress log messages
process.env.LOG_LEVEL = 'fatal';
