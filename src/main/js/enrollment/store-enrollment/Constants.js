'use strict';

var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
	PRICE_ITEM_ACTION: null,
	PRICED_ITEM_RECEIVED: null,
	PRICED_ITEM_ERROR: null,
	VERIFY_BILLING_INFO: null,
	BILLING_INFO_VERIFIED: null,
	BILLING_INFO_REJECTED: null,
	SUBMIT_STRIPE_PAYMENT: null
});
