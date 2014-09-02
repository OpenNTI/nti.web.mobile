/** @module login/LoginActions */

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var NavigationConstants = require('./NavigationConstants');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge')

/**
 * Actions available to views for login-related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	/** Initializes the login system. */
	navigate: function(href) {
		console.log('NavigationActions::navigate');
		AppDispatcher.handleViewAction({
			actionType: NavigationConstants.NAVIGATE,
			href: href
		});
	}

});

