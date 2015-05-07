import AppDispatcher from 'dispatcher/AppDispatcher';
import * as Constants from './Constants';
import {EventEmitter} from 'events';

const bufferTime = 500;


export default Object.assign({}, EventEmitter.prototype, {


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
