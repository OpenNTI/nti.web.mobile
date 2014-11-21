'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Constants = require('./Constants');
var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;

var Utils = require('common/Utils');


var _stripeToken; // store the result of a Stripe.getToken() call
var _coupon;
var _giftInfo;
var _paymentFormData = {}; // store cc info so we can repopulate the form if the user navigates back from the confirmation view.
var _paymentResult;
var _couponTimeout;

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'store-enrollment.Store',

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	priceItem: function(purchasable) {
		return getStripeInterface()
			.then(function(stripe) {
				return stripe.getPricing(purchasable);
			})
			.then(function(pricedItem) {
				Store.emitChange({
					type: Constants.PRICED_ITEM_RECEIVED,
					pricedItem: pricedItem
				});
				return pricedItem;
			});
	},

	getStripeToken: function() {
		if(!_stripeToken) {
			throw new Error("Store doesn't currently have a stripe token. (Did you get a BILLING_INFO_VERIFIED event after a call to Actions.verifyBillingInfo?)");
		}
		return Object.assign({},_stripeToken);
	},

	getCoupon: function() {
		return _coupon;
	},

	getGiftInfo: function() {
		return _giftInfo;
	},

	getPaymentFormData: function() {
		var data = Object.assign({},_paymentFormData);

		// don't repopulate credit card number
		delete data.number;
		// don't repopulate cvc
		delete data.cvc;

		return data;
	},

	getPaymentResult: function() {
		return _paymentResult;
	}

});

function getStripeInterface() {
	var me = getStripeInterface;

	if (!me.promise) {
		me.promise = Promise.resolve(
			Utils.getServer().getStripeInterface());
	}

	return me.promise;
}

function _pullData(data) {
	var result = {};

	var add = x => { if (data[x]) {result[x] = data[x]; } };

	_coupon = data.coupon;

	add('from');
	add('to');
	add('receiver');
	add('message');
	add('sender');

	_giftInfo = result;
}

function _verifyBillingInfo(data) {

	_stripeToken = null; // reset
	_coupon = null;
	_giftInfo = null;
	_paymentFormData = data.formData;

	return getStripeInterface()
		.then(function(stripe) {
			return stripe.getToken(data.stripePublicKey,data.formData);
		})
		.then(function(result) {
			var eventType = result.status === 200 ? Constants.BILLING_INFO_VERIFIED : Constants.BILLING_INFO_REJECTED;
			_stripeToken = result.response;
			_pullData(_paymentFormData);
			Store.emitChange({
				type: eventType,
				status: result.status,
				response: result.response
			});
		})
		.catch(function(reason) {
			console.error('verifyBillingInfo failed. %O', reason);
		});
}

function _submitPayment(formData) {
	_paymentResult = null;

	return getStripeInterface()
		.then(function(stripe){
			return stripe.submitPayment(formData);
		})
		.then(function(result) {
			var type = (result||{}).State === 'Success' ? Constants.STRIPE_PAYMENT_SUCCESS : Constants.STRIPE_PAYMENT_FAILURE;
			if (type === Constants.STRIPE_PAYMENT_SUCCESS) {
				_paymentFormData = {}; //
				_stripeToken = null;
			}

			_paymentResult = result;

			Store.emitChange({
				type: type,
				purchaseAttempt: result
			});
		});
}

function _priceWithCoupon(data) {
		if (!_couponTimeout) {
			Store.emitChange({
				type: Constants.LOCK_SUBMIT
			});
		}

		clearTimeout(_couponTimeout);

		_couponTimeout = setTimeout(function() {
			return getStripeInterface()
				.then(function(stripe) {
					return stripe.getCouponPricing(data.purchasable, data.coupon);
				})
				.then(function(result) {
					Store.emitChange({
						type: Constants.VALID_COUPON,
						pricing: result,
						coupon: data.coupon
					});

					Store.emitChange({
						type: Constants.UNLOCK_SUBMIT
					});
				})
				.catch(function(/*reason*/) {
					Store.emitChange({
						type: Constants.INVALID_COUPON,
						coupon: data.coupon
					});

					Store.emitChange({
						type: Constants.UNLOCK_SUBMIT
					});
				});
		}, 2000);
}

Store.appDispatch = AppDispatcher.register(function(data) {
    var action = data.action;

    switch(action.type) {
    	case Constants.UPDATE_COUPON:
    		_priceWithCoupon(action.payload);
    		break;

    	case Constants.VERIFY_BILLING_INFO:
    		_verifyBillingInfo(action.payload);
			break;

    	case Constants.SUBMIT_STRIPE_PAYMENT:
    		_submitPayment(action.payload.formData);
	    	break;

        default:
            return true;
    }
    return true;
});


module.exports = Store;
