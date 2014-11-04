'use strict';
/** @module login/LoginActions */

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var ActionConstants = require('./Constants').actions;
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

/**
 * Actions available to views for login-related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	/**
	* Fired in response to user changes on the form.
	*/
	preflight: function(data) {
		console.log('SignupActions::preflight');
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.PREFLIGHT,
			fields: (data && data.fields)
		});
	},

	createAccount: function(data) {
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.CREATE_ACCOUNT,
			fields: (data && data.fields)
		});
	},

	clearErrors: function() {
		AppDispatcher.handleViewAction({
			actionType: ActionConstants.CLEAR_ERRORS
		});
	}

});
