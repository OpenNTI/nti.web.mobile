'use strict';
/** @module login/LoginActions */

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Environment = require('react-router-component').environment;
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge')

var Constants = require('./Constants');
//var Store = require('./Store');


/**
 * Actions available to views for login-related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	/** Initializes the login system. */
	navigate: function(href, replace) {
		console.log('navigation.Actions::navigate', href, !!replace);
		Environment.defaultEnvironment.navigate(href, {replace:replace});
	},


	publishNav: function(navRecord) {
		console.log('navigation.Actions::publishNav', navRecord);
		AppDispatcher.handleViewAction({
			actionType:Constants.PUBLISH_NAV,
			nav: navRecord
		});
	}

});
