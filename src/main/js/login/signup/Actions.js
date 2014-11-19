'use strict';
/** @module login/LoginActions */

var AppDispatcher = require('dispatcher/AppDispatcher');
var ActionConstants = require('./Constants').actions;
var EventEmitter = require('events').EventEmitter;


var bufferTime = 500;

/**
 * Actions available to views for login-related functionality.
 **/
module.exports = Object.assign({}, EventEmitter.prototype, {

	/**
	* Fired in response to user changes on the form.
	*/
	preflight: function preflight(data) {
		clearTimeout(preflight.buffer);
		preflight.buffer = setTimeout(function(){
			AppDispatcher.handleViewAction({
				type: ActionConstants.PREFLIGHT,
				fields: (data && data.fields)
			});
		}, bufferTime);
	},

	createAccount: function(data) {
		AppDispatcher.handleViewAction({
			type: ActionConstants.CREATE_ACCOUNT,
			fields: (data && data.fields)
		});
	},

	clearErrors: function() {
		AppDispatcher.handleViewAction({
			type: ActionConstants.CLEAR_ERRORS
		});
	}

});
