'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var Constants = require('./Constants');
var CHANGE_EVENT = require('common/Constants').CHANGE_EVENT;

var getService = require('common/utils').getService;

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
		return getService()
			.then(function(service) {
				var stripe = service.getStripeEnrollment();
				return stripe.getPricing(purchasable);
			})
			.then(function(pricedItem) {
				Store.emitChange({
					eventType: Constants.PRICED_ITEM_RECEIVED,
					pricedItem: pricedItem
				});
			})
			.catch(function(reason) {
				console.error(reason);
			});
	}

});


Store.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.actionType) {

        default:
            return true;
    }
    return true;
});


module.exports = Store;
