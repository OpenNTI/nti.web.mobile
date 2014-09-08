'use strict';
/** @module notifications/Actions */
var merge = require('react/lib/merge')

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Api = require('./Api');
var Constants = require('./Constants');

/**
 * Actions available to views for library-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {

	load: function() {
		console.log('Notifications Action: Load called');
        Api.load();
    },
});
