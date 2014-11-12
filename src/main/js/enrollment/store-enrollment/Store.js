'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var Constants = require('./Constants');
var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;

var getService = require('common/Utils').getService;

var _stripeToken; // store the result of a Stripe.getToken() call
var _billingInfo;

var Store = merge(EventEmitter.prototype, {
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
		return _getStripeEnrollment()
			.then(function(stripe) {
				return stripe.getPricing(purchasable);
			})
			.then(function(pricedItem) {
				Store.emitChange({
					type: Constants.PRICED_ITEM_RECEIVED,
					pricedItem: pricedItem
				});
			})
			.catch(function(reason) {
				console.error(reason);
			});
	},

	getStripeToken: function() {
		if(!_stripeToken) {
			throw new Error("Store doesn't currently have a stripe token. (Did you get a BILLING_INFO_VERIFIED event after a call to Actions.verifyBillingInfo?)");
		}
		return _stripeToken;
	},

	getBillingInfo: function() {
		if(!_billingInfo) {
			throw new Error("Store doesn't have billing info. (Have you called Actions.verifyBillingInfo?)");
		}
		return _billingInfo;
	}

});

function _getStripeEnrollment() {
	return getService()
		.then(function(service) {
			return service.getStripeEnrollment();
		});
}

function _verifyBillingInfo(data) {
	_stripeToken = null; // reset
	_billingInfo = data.formData;
	return _getStripeEnrollment()
		.then(function(stripe) {
			return stripe.getToken(data.stripePublicKey,data.formData);
		})
		.then(function(result) {
			var eventType = result.status === 200 ? Constants.BILLING_INFO_VERIFIED : Constants.BILLING_INFO_REJECTED;
			_stripeToken = result.response;
			Store.emitChange({
				type: eventType,
				status: result.status,
				response: result.response
			});
		})
		.catch(function(reason) {
			console.error('verifyBillingInfo failed. %O', reason);
			debugger;
		});
}

function _submitPayment(formData) {
	return _getStripeEnrollment()
		.then(function(stripe){
			return stripe.submitPayment(formData);
		})
		.then(function(result) {
			console.debug(result);
			debugger;
		});
}

Store.appDispatch = AppDispatcher.register(function(data) {
    var action = data.action;
    switch(action.type) {

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
