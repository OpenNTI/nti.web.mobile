'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var Constants = require('./Constants');

module.exports = {
	verifyBillingInfo: function(stripePublicKey, formData) {
		dispatch(
			Constants.VERIFY_BILLING_INFO,
			{	
				stripePublicKey: stripePublicKey,
				formData: formData
			}
		);
	}
};

function dispatch(key, data) {
	var action = {
		actionType: key,
		payload: data
	};
	AppDispatcher.handleRequestAction(action);
}
