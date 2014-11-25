'use strict';

var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
	EDIT: null,
	RESET: null,

	LOCK_SUBMIT: null,
	UNLOCK_SUBMIT: null,
	UPDATE_COUPON: null,
	VALID_COUPON: null,
	INVALID_COUPON: null,
	INVALID_GIFT_CODE: null,
	GIFT_CODE_REDEEMED: null,
	PRICE_ITEM_ACTION: null,
	PRICED_ITEM_RECEIVED: null,
	PRICED_ITEM_ERROR: null,
	VERIFY_BILLING_INFO: null,
	BILLING_INFO_VERIFIED: null,
	BILLING_INFO_REJECTED: null,
	SUBMIT_STRIPE_PAYMENT: null,
	STRIPE_PAYMENT_SUCCESS: null,
	STRIPE_PAYMENT_FAILURE: null
});
