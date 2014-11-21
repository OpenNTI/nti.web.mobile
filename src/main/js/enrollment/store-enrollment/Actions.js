'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
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
	},

	submitPayment: function(payload) {
		dispatch(
			Constants.SUBMIT_STRIPE_PAYMENT,
			{formData: payload}
		);
	},


	updateCoupon: function(purchasable, coupon) {
		dispatch(
			Constants.UPDATE_COUPON,
			{purchasable: purchasable, coupon: coupon}
		);
	}
};

function dispatch(key, data) {
	var action = {
		type: key,
		payload: data
	};
	AppDispatcher.handleRequestAction(action);
}
