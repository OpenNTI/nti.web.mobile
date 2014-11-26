'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Constants = require('./Constants');
var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;
//var ERROR_EVENT = require('common/constants').ERROR_EVENT;

var Utils = require('common/Utils');
var getService = Utils.getService;

var _stripeToken; // store the result of a Stripe.getToken() call
var _pricing;
var _giftInfo;
var _paymentFormData = {}; // store cc info so we can repopulate the form if the user navigates back from the confirmation view.
var _paymentResult;
var _couponTimeout;
var _couponPricing;

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'store-enrollment.Store',

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	emitError: function(event) {
		this.emitChange(Object.assign({ isError: true}, event));
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

	getPricing: function() {
		return _pricing;
	},

	getGiftInfo: function() {
		return _giftInfo;
	},

	getCouponPricing: function() {
		return _couponPricing;
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

	var copy = x => {
		if (data.hasOwnProperty(x)) {
			result[x] = data[x]; } };
	var pull = x => {
		copy(x);
		delete data[x];
	};

	_pricing = {
		coupon: data.coupon,
		/* jshint -W106*/
		expected_price: data.expected_price
		/* jshint +W106*/
	};

	copy('from');
	pull('to');
	pull('toFirstName');
	pull('toLastName');
	pull('receiver');
	pull('message');
	pull('sender');

	_giftInfo = data.from && Object.keys(result).length ? result : null;
}

function _verifyBillingInfo(data) {

	_stripeToken = null; // reset
	_pricing = null;
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
			_couponPricing = null;

			return getStripeInterface()
				.then(function(stripe) {
					return stripe.getCouponPricing(data.purchasable, data.coupon);
				})
				.then(function(result) {
					_couponPricing = result;

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

function _getEnrollmentService() {
	return getService().then(function(service) {
		return service.getEnrollment();
	});
}

function _redeemGift(purchasable, accessKey) {
	return _getEnrollmentService().then(function(service) {
		return service.redeemGift(purchasable, accessKey);
	});
}

Store.appDispatch = AppDispatcher.register(function(data) {
    var action = data.action;

    switch(action.type) {
		case Constants.EDIT:
			Store.emitChange({
				type: action.type,
				mode: action.payload.mode
			});
			break;

		case Constants.RESET:
			_pricing =
			_giftInfo =
			_couponPricing =
			_paymentFormData =
			_paymentResult = null;
			Store.emitChange({
				type: action.type,
				options: (action.payload||{}).options
			});
			break;

    	case Constants.UPDATE_COUPON:
    		_priceWithCoupon(action.payload);
    		break;

    	case Constants.VERIFY_BILLING_INFO:
    		_verifyBillingInfo(action.payload);
			break;

    	case Constants.SUBMIT_STRIPE_PAYMENT:
    		_submitPayment(action.payload.formData);
	    	break;

	    case Constants.GIFT_PURCHASE_DONE:
	    	Store.emitChange({
	    		type: action.type
	    	});
	    	break;

		case Constants.REDEEM_GIFT:
	    	_redeemGift(action.payload.purchasable, action.payload.accessKey)
	    	.then(function(result) {
	    		Store.emitChange({
	    			type: Constants.GIFT_CODE_REDEEMED,
					action: action,
					result: result
				});
	    	},function(reason) {

	    		var message = reason.responseJSON.Message;

	    		Store.emitError({
	    			type: Constants.INVALID_GIFT_CODE,
					action: action,
					reason: message
				});
	    	});
	    	break;

        default:
            return true;
    }
    return true;
});


module.exports = Store;
