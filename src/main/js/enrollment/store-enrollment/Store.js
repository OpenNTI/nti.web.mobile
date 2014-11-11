'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var Constants = require('./Constants');
var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;

var getService = require('common/Utils').getService;

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
	}

});

function _getStripeEnrollment() {
	return getService()
		.then(function(service) {
			return service.getStripeEnrollment();
		});
}

function _verifyBillingInfo(data) {
	return _getStripeEnrollment()
		.then(function(stripe) {
			return stripe.getToken(data.stripePublicKey,data.formData);
		})
		.then(function(result) {
			var eventType = result.status === 200 ? Constants.BILLING_INFO_VERIFIED : Constants.BILLING_INFO_REJECTED;
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

Store.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {

    	case Constants.VERIFY_BILLING_INFO:
    		_verifyBillingInfo(action.payload);
    	break;

        default:
            return true;
    }
    return true;
});


module.exports = Store;
