import AppDispatcher from 'dispatcher/AppDispatcher';
import * as Constants from './Constants';

const bufferTime = 500;


export default {


	preflight: function preflight(data) {
		clearTimeout(preflight.buffer);
		preflight.buffer = setTimeout(() => {
			AppDispatcher.handleViewAction({
				type: Constants.PREFLIGHT,
				fields: (data && data.fields)
			});
		}, bufferTime);
	},

	preflightAndCreateAccount (data) {
		AppDispatcher.handleViewAction({
			type: Constants.PREFLIGHT_AND_CREATE_ACCOUNT,
			fields: (data && data.fields)
		});
	},

	createAccount (data) {
		AppDispatcher.handleViewAction({
			type: Constants.CREATE_ACCOUNT,
			fields: (data && data.fields)
		});
	},

	clearErrors () {
		AppDispatcher.handleViewAction({
			type: Constants.CLEAR_ERRORS
		});
	}

};
