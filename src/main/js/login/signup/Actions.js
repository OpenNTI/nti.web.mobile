
/** @module login/LoginActions */

import AppDispatcher from 'dispatcher/AppDispatcher';
import * as Constants from './Constants';
import {EventEmitter} from 'events';

const bufferTime = 500;

/**
 * Actions available to views for login-related functionality.
 **/
export default Object.assign({}, EventEmitter.prototype, {

	/**
	* Fired in response to user changes on the form.
	*/
	preflight: function preflight(data) {
		clearTimeout(preflight.buffer);
		preflight.buffer = setTimeout(function(){
			AppDispatcher.handleViewAction({
				type: Constants.PREFLIGHT,
				fields: (data && data.fields)
			});
		}, bufferTime);
	},

	preflightAndCreateAccount: function(data) {
		AppDispatcher.handleViewAction({
			type: Constants.PREFLIGHT_AND_CREATE_ACCOUNT,
			fields: (data && data.fields)
		});
	},

	createAccount: function(data) {
		AppDispatcher.handleViewAction({
			type: Constants.CREATE_ACCOUNT,
			fields: (data && data.fields)
		});
	},

	clearErrors: function() {
		AppDispatcher.handleViewAction({
			type: Constants.CLEAR_ERRORS
		});
	}

});
