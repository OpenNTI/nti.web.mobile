'use strict';
/** @module library/LibraryActions */
var merge = require('react/lib/merge')

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Api = require('./LibraryApi');
var Constants = require('./LibraryConstants');

/**
 * Actions available to views for library-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {

	loadLibrary: function() {
		console.log('Library Action: Load called');
        Api.load();
    },
});
